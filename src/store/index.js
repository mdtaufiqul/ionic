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
            
              if(stream && stream.type == 'live' && stream.enabled){
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
    catch(error){
      if (!error.response) {
        checkInternet()
    } else {
      console.log(error.response.data.message)
    }
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
          .catch(error => {
            if (!error.response) {
              checkInternet()
          } else {
            console.log(error.response.data.message)
          }
          }
          )

    }
    catch(error){
      if (!error.response) {
        checkInternet()
      } else {
        console.log(error.response.data.message)
        
      }
    }
      }
    }



async function checkInternet(){
  Promise.resolve(await userServices.checkOnlineStatus()).then((result)=>{
  console.log('isOnline: '+result);
    return result
  })
}

export default new Vuex.Store({
  namespaced: true,
  state,
  mutations,
  actions
});

