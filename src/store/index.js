import Vuex from 'vuex';
import userServices from '@/services/services';
import _ from 'lodash';
  const state= {
    streamarray: [],
    isLoading: false,
    connected: navigator.onLine
  };

  const mutations= {
    IS_LOADING(state, isLoading) {
		state.isLoading = isLoading;
	},
  SAVE_STREAMS(state, streams) {
    state.streamarray = streams;
  },
  SET_CONNECTED(state, payload) {
    state.connected = payload
  }
  };

  const actions= {
    setConnected ({ commit }, payload) {
      console.log('dispatching');
      commit('SET_CONNECTED', payload)
    },
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
          Promise.all(pulseAdded)
          .then(results => {
            commit('SAVE_STREAMS', {streams: result});
            dispatch('setIsLoading', false);
            console.log('user loaded');
            dispatch('loadVOD');
          })
          .catch(e => {
            console.error(e);
          })

      
        
        }); 
    }
    catch(e){
        console.log(e);
    }
      },
   async loadVOD({commit, dispatch}) {
    try {
          let videos = [];
          let videoLists = state.streamarray.streams.map(async function(stream){
            if( stream.type == 'vod' ) {
              let list = await userServices.getStreamVideolist(stream)
              videos.push(list);
            }
          })
          // videos = _.flatten(videos);

          Promise.all(videoLists)
          .then(results => {
            commit('SAVE_STREAMS', {
              streams: state.streamarray.streams,
              allvideos: _.flatten(videos)
            });
            console.log('vod loaded');
          })
          .catch(e => {
            console.error(e);
          })

    }
    catch(e){
        console.log(e);
    }
      }
    }

  const getters = {
    isConnected: state => state.connected
};

  export default new Vuex.Store({
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  });