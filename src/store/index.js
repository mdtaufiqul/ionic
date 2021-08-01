import Vuex from 'vuex';
import userServices from '@/services/services';
import _ from 'lodash';
  const state= {
    streamarray: [],
    isLoading: false,
  };

  const mutations= {
    IS_LOADING(state, isLoading) {
		state.isLoading = isLoading;
	},
    SAVE_STREAMS(state, streams) {
      state.streamarray = streams;
    }
  };

  const actions= {
    setIsLoading({ commit }, isLoading) {
		commit('IS_LOADING', isLoading);
	},
   async loadStreams({commit, dispatch}) {
    try {
        dispatch('setIsLoading', true);
        await userServices.getStreams().then(result => {
        let pulseAdded = result.map(async function(stream){
          if(stream.type == 'live' && stream.enabled){
            await userServices.findMediapulse(stream)
          }
          })
        
          // let vodAdded = result.map(async function(stream){
          //   stream.type == 'vod' && await userServices.getStreamPlaylist(stream)
          // })
          let videos = [];
          let videoLists = result.map(async function(stream){
            if( stream.type == 'vod' ) {
              let list = await userServices.getStreamVideolist(stream)
              videos.push(list);
            }
          })
          // videos = _.flatten(videos);

          Promise.all(pulseAdded)
          .then(results => {
            commit('SAVE_STREAMS', {streams: result});
            dispatch('setIsLoading', false);
            console.log('user loaded');
            Promise.all(videoLists)
            .then(results => {
              commit('SAVE_STREAMS', {
                streams: result,
                allvideos: _.flatten(videos)
              });
              console.log('vod loaded');
            })
          })
          .catch(e => {
            console.error(e);
          })

      
        
        }); 
    }
    catch(e){
        console.log(e);
    }
      }
    }

  const getters = {
      
};

  export default new Vuex.Store({
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  });