<template>
  <div
    id="thumb-container"
    ref="thumbContainer"
    class=""
  >
    <div
      v-show="!hasStreamThumb"
      class="placeholder"
    >
      <div v-if="stream.enabled">
        <span
          class="thumb__message d-flex justify-content-center align-items-center flex-column "
        >Waiting for frames</span>
      </div>
    </div>
  </div>
</template>

<script>
import userServices from '@/services/services';
export default {
	name: 'StreamThumb',
	components: {
		userServices
	},
	props: {
		stream: {
			type: Object,
			required: true,
			validator(v) {
				return Object.prototype.hasOwnProperty.call(v, '_id');
			}
		},
		mediaPulse: {
			type: Object,
			default() { return {}; }
		}
	},
	data() {
		return {
			scopeAlive: true,
			hasStreamThumb: null,
			thumbUrl: null,
			savedSchedulerConfig: null,
			scheduleMode: null,
			schedulerConfigProcessing: false,
			scheduleConfigLoaded: false,
			scheduleTimeActive: false,
			thumbCreated: false
		};
	},
	computed: {
		countdownSecsLeft () {
			const value = this.savedSchedulerConfig.datetime - Date.now();
			return Math.max(value, 0);
		}
	},
	watch: {
		mediaPulse () {
			// overwrite url if load balancer enabled
			const hostId = this.mediaPulse && this.mediaPulse.hostId;
			if (hostId) {
				const anc = document.createElement('a');
				anc.href = this.thumbUrl;
				// if (/\w+-\d+/gi.test(hostId)) {
				if (/\w+-\d+/gi.test(hostId) || this.stream.pullUrl) {
					anc.hostname = `${hostId}.castr.io`;
				}
				this.thumbUrl = anc.href;
				if (!this.thumbCreated && this.thumbUrl) {
					this.setThumbnail();
				}
			}
		}
	},
	async mounted() {
				if(this.stream.thumburl){
					this.thumbUrl = this.stream.thumburl
					this.hasStreamThumb = this.stream.enabled && this.mediaPulse && this.mediaPulse.alive
				}
				this.thumbUrl = await userServices.getStreamPreviewThumbUrl(this.stream._id);
	},
	unmounted() {
		this.scopeAlive = false;
	},
	methods: {
		setThumbnail: function setThumbnail() {
			if (!this.scopeAlive) return;

			const thumbContainer = this.$refs.thumbContainer;

			// prepare a new video element to overalp existing ones
			let mediaElement;
			const streamEnabled = this.stream && this.stream.enabled;
			const streamAlive = this.mediaPulse && this.mediaPulse.alive;

			if (streamEnabled && streamAlive && thumbContainer) {
				const isWowzaRegion = !!this.stream.region.v2;
				if (isWowzaRegion) {
					const thumbUrl = this.getVideoThumbUrl();
					if (thumbUrl) {
						this.thumbCreated = true;
						mediaElement = createImgInstance(thumbUrl, () => {
							thumbContainer.appendChild(mediaElement);
						});
					}
				} else {
					const videoSrc = this.getVideoPreviewUrl();
					mediaElement = createVideoInstance(videoSrc);
					if (mediaElement) {
						this.thumbCreated = true;
						thumbContainer.appendChild(mediaElement);
						// preview fix for edge: play video to let video thumb appear
						mediaElement.play();
					}
				}
			}

			// add few secs delay to make the video chunk appear
			if (mediaElement) {
				setTimeout(() => {
					mediaElement.className = mediaElement.className + ' ready';

					// reschedule thumb setup
					scheduleSetup.call(this, mediaElement.tagName.toLowerCase());
				}, 3000);
			} else {
				// reschedule thumb setup
				scheduleSetup.call(this);
			}

			function scheduleSetup(thumbType = 'video') {
				// setTimeout(setThumbnail.bind(this), 8000)

				if (!thumbContainer) return;

				// remove old video thumbs
				const streamEnabled = this.stream.enabled;

				// recheck if placeholder text has to appear instead of video thumb
				const hasStreamThumb = streamEnabled && this.mediaPulse && this.mediaPulse.alive;
				this.hasStreamThumb = hasStreamThumb;

				const mediaEls = thumbContainer.getElementsByTagName(thumbType);
				Array.prototype.forEach.call(mediaEls, mediaEl => {
					// remove video if stream is offline or is older video
					if (!hasStreamThumb || mediaEl !== mediaElement) {
						if (this.$refs.thumbContainer) {
							this.$refs.thumbContainer.removeChild(mediaEl);
						}
					}
				});
			}
		},
		getVideoPreviewUrl() {
			if (!this.mediaPulse || !this.mediaPulse.alive) return;
			const randomkey = Math.random().toString().slice(2);
			const vidUrl = this.thumbUrl + `&rand=${randomkey}`;
			return vidUrl;
		},

		onScheduleCountdownTick (value, forceEnded) {
			if (!this.savedSchedulerConfig) return;
			let offset = 0;
			if (!forceEnded) {
				offset = this.savedSchedulerConfig.datetime - Date.now();
				offset /= 1000;
				if (value) offset = value.totalSeconds;
			}
			this.scheduleTimeActive = offset <= 0;
		}
	}
};

function createVideoInstance(videoSrc) {
	if (!videoSrc) return;
	const vid = document.createElement('video');
	vid.src = videoSrc;
	vid.muted = true;
	vid.playsinline = true;
	vid.setAttribute('playsinline', true);
	return vid;
}

function createImgInstance(imgSrc, callback) {
	if (!imgSrc) return;
	const img = document.createElement('img');
	img.src = imgSrc;
	img.className = 'stream-preview';
	img.onload = () => void callback();
	return img;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.thumb, .video-thumb {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 188px;
	background: #000;
}

.thumb >>> .stream-preview {
	max-height: 100%;
	max-width: 100%;
}
.thumb__message {
	text-align: center;
	height: 100%;
	width: 100%;
	position: absolute;
	left: 50%;
	color: var(--c-dark-5);
	top: 50%;
	transform: translateY(-50%) translateX(-50%);
	cursor: pointer;
	z-index: 0;
	min-width: 300px;
}
.scheduler-countdown-content .value-container {
    margin: 0;
}
.placeholder {
    width: 100%;
    position: absolute;
}

</style>
