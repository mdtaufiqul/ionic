import api from '@/api'
import _ from 'lodash';
import store from '../store';
const streamPreviewThumbUrlHash = {};
export default {
    getStreams,
    getStreamMediaPulse,
	getStreamPreviewThumbUrl,
	findMediapulse,
	getStreamPlaylist,
	getStreamVideolist
}

async function getStreams() {
    let  streamLists =  await makeRequest('/streams/mystreams');
	return streamLists
}

async function findMediapulse(stream) {
	let  mediapulse = null;
	mediapulse = stream.key &&  await getStreamMediaPulse(stream.key);
	stream.mediapulse = mediapulse
	if(mediapulse && mediapulse.alive){
		stream.thumburl = await getStreamPreviewThumbUrl(stream._id)
	}
	return stream
}

async function getStreamPlaylist(streamID) {
	let list = [];
	list = await makeRequest(`/streams/${streamID}/schedular/playlist`);
	return list
}

async function getStreamVideolist(stream) {
	let list = [];
	list = await makeRequest(`/streams/${stream._id}/schedular/playlist`);
	list.map(function(single){
		single.foldername = stream.name
	});
	return list
}

async function getStreamPreviewThumbUrl(streamId) {
	const uri = `/streams/${streamId}/preview/thumbUrl`;
	let thumbUrl = streamPreviewThumbUrlHash[streamId];
	if (thumbUrl) {
		return thumbUrl;
	}

	thumbUrl = await makeRequest(uri);
	if (thumbUrl) {
		streamPreviewThumbUrlHash[streamId] = thumbUrl;
	}

	return thumbUrl;
}

async function getStreamMediaPulse(streamKey) {
	let isBackupKey = false;
	if (streamKey.includes('_backup')) {
		isBackupKey = true;
		streamKey = streamKey.replace('_backup', '');
	}

	let pulseUri = streamPulseEndpointsHash[streamKey];
	if (!pulseUri) {
		pulseUri = await getStreamMediaPulseEndpoint(streamKey);
		if (pulseUri) {
			streamPulseEndpointsHash[streamKey] = pulseUri;
		}
	}

	if (isBackupKey) {
		pulseUri = `${pulseUri}_backup`
	}
	// pulseUri = 'https://stats.castr.io/pulse/schb9161a307c9b11eaae925dc2950a0e41'
	let mediaPulse = await makeRequest(pulseUri);
	// let proxyUri = `${process.env.VUE_APP_APP_API_BASE}/pulse/proxy?uri=${pulseUri}`
	// let mediaPulse = await makeRequest(proxyUri)

	if (pulseUri.indexOf('stats.castr.io') && mediaPulse && mediaPulse[0]) {
		const originPulse = mediaPulse;
		mediaPulse = buildPulseObject(originPulse[0].value);
		mediaPulse.name = originPulse[0].value.name;
		mediaPulse.hostId = originPulse[0].stream_id;
		mediaPulse.isWowza = _.get(originPulse, ['0', 'wowza'], false);
	}
	return mediaPulse;
}
function buildPulseObject(streamStats) {
	const pulse = { alive: false };

	const stats = streamStats.stats;
	if (stats) {
		pulse.alive = stats.alive;
		pulse.bitrate = stats.bitrate;
		pulse.push_stats = stats.push_stats;

		const mediaInfo = stats.media_info;
		if (mediaInfo &&
      mediaInfo.tracks &&
      mediaInfo.tracks.length) {
			let streamWidth;
			let streamHeight;
			const mediaCodecs = [];

			mediaInfo.tracks.forEach((mediaTrack) => {
				if (!mediaTrack) return;

				const trackType = mediaTrack.content;
				const codecItem = {
					type: trackType,
					codec: mediaTrack.codec
				};

				if (mediaTrack.fps) {
					pulse.fps = mediaTrack.fps;
				}

				// mediaCodecs.push(codecItem.join('-'))
				mediaCodecs.push(codecItem);

				// check for stream width, height
				if (mediaTrack.content === 'video') {
					streamWidth = mediaTrack.pixel_width || mediaTrack.width;
					streamHeight = mediaTrack.pixel_height || mediaTrack.height;
				}
			});

			pulse.codecs = mediaCodecs;
			pulse.width = streamWidth;
			pulse.height = streamHeight;
		}
	}

	return pulse;
}
const streamPulseEndpointsHash = {};
function getStreamMediaPulseEndpoint(streamKey) {
	const uri = `/streams/${streamKey}/pulseEndpoint`;
	return makeRequest(uri);
}
async function makeRequest(reqConfig) {
    if (typeof reqConfig === 'string') {
		reqConfig = {
			path: reqConfig
		}
	}
    reqConfig.url = reqConfig.path+'?apiKey=castrkey_470c2d30-defb-11eb-90fa-f582e5f1edf5'
    let res
    try {
        res = await api.request(reqConfig)
    } catch (err) {
        return
    }

    return res.data
}