// import { createStore } from 'vuex';
// import userServices from '@/services/services';

// const store = createStore({
//     state() {
//         return {
//             apikey : 'castrkey_a72434d0-deef-11eb-bf1a-751aff539a7c'
//         };
//     },
//     getters: {
//         getApi(state){
//             return state.apikey;
//         },
//         async getStreams(){
//             return await userServices.getStreams('/streams?apiKey=castrkey_470c2d30-defb-11eb-90fa-f582e5f1edf5')
//         }
//     }
// });

// export default store;
import Vuex from 'vuex';
import userServices from '@/services/services';
import _ from 'lodash';
  const state= {
    users: [],
    isLoading: false,
  };

  const mutations= {
    IS_LOADING(state, isLoading) {
		state.isLoading = isLoading;
	},
    SAVE_USERS(state, users) {
      state.users = users;
    }
  };

  const actions= {
    setIsLoading({ commit }, isLoading) {
		commit('IS_LOADING', isLoading);
	},
   async loadUsers({commit, dispatch}) {
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
            commit('SAVE_USERS', {streams: result});
            dispatch('setIsLoading', false);
            console.log('user loaded');
            Promise.all(videoLists)
            .then(results => {
              commit('SAVE_USERS', {
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