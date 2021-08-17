<template>
  <ion-page>
    <ion-content>
      <div
        v-if="connected"
        class="content-inner"
      >
        <ion-tabs
          :class=" showPadding ? 'base-padding' : 'ion-no-padding' "
          @ionTabsWillChange="beforeTabChange"
        >
          <ion-header v-if="showHeader">
            <ion-toolbar>
              <ion-buttons
                slot="start"
                class="ion-no-margin"
              >
                <ion-title class="text-s-xxl fw-500 ion-no-padding color-light">
                  {{ (activeMenu == 'live') ? 'Stream' : 'VOD' }}
                </ion-title>
              </ion-buttons>
              <ion-item
                slot="end"
                class="ion-no-border"
              >
                <ion-text color="medium">
                  <h3 class="ion-no-margin text-s-s">
                    {{ profileName }}
                  </h3>
                </ion-text>
                <ion-thumbnail
                  v-if="ottPoster"
                  slot="end"
                  class="image-small"
                >
                  <img
                    :src="ottPoster"
                    :alt="profileName"
                  >
                </ion-thumbnail>
              </ion-item>
            </ion-toolbar>
          </ion-header>
          <div class="main-content">
            <!-- ====main-content slot==== -->
            <slot
              name="content"
              :activeMenu="activeMenu"
              :posterUrl="ottPoster"
              :profileName="profileName"
            />
          </div>
          <!-- Footer Slide Start -->
          <ion-tab-bar
            v-if="showFooter"
            slot="bottom"
          >
            <ion-tab-button
              tab="live"
              href="/stream/live"
            >
              <img
                src="@/assets/images/aio_stream.png"
                alt="Stream"
              >
              <ion-label
                color="medium"
                class="fw-500 text-s-xs"
              >
                Stream
              </ion-label>
            </ion-tab-button>
            <ion-tab-button
              tab="vod"
              href="/stream/vod"
            >
              <img
                src="@/assets/images/vod.png"
                alt="VOD"
              >
              <ion-label
                color="medium"
                class="fw-500 text-s-xs"
              >
                VOD
              </ion-label>
            </ion-tab-button>
          </ion-tab-bar>
          <!-- Footer Slide Ends -->
        </ion-tabs>
      </div>
      <div
        v-else
        class="no-internet"
      >
        <ion-thumbnail slot="end">
          <img
            src="@/assets/images/nointernet.png"
            alt="No Internet"
          >
        </ion-thumbnail>
        <ion-text>
          <h2 class="color-text-2 text-s-custom">
            WHOOPS!
          </h2>
          <p class="color-text-6 text-s-m">
            You are not connected to the internet. Please check your connection or try again.
          </p>
          <ion-buttons
            class="no-internet-btn"
            href="/"
          >
            Try Again
          </ion-buttons>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { mapGetters } from 'vuex'
import userServices from '@/services/services';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

import {
  IonItem,
  IonContent,  
  IonPage,  
  IonLabel, 
  IonTabBar, 
  IonTabButton, 
  IonTabs,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonSpinner,
  IonText,
  IonThumbnail,
  useIonRouter 
} from "@ionic/vue";


export default {
  components: {
    userServices,
    useIonRouter ,
  IonContent,IonItem,
  IonPage,
  IonHeader,  
  IonButtons,
  IonToolbar,
  IonTitle,
  IonLabel, 
  IonTabBar, 
  IonTabButton, 
  IonTabs,
  IonSpinner,
  IonText,
  IonThumbnail
  },
  props: [ "pageTitle", "showHeader", "showFooter", "showPadding" ], 
  data() {
      return {
          activeMenu: 'live',
          ottPoster: null,
          profileName: null,
          exitapp: true,
          connected: navigator.onLine
      }
  },
	watch: {
		async connected () {
			// overwrite url if load balancer enabled
		   if(this.connected){
         console.log('once once once');
             try {
                  await this.$store.dispatch('loadStreams')
              } catch (e) {
                  console.log(e);
              } 
          }
		}
	},
  async mounted() {
      setInterval(async () => {
       Promise.resolve(await userServices.checkOnlineStatus()).then(async (result)=>{
          console.log('isOnline: '+result);
          this.connected = result
          // if(result){
          //    try {
          //         await this.$store.dispatch('loadStreams')
          //     } catch (e) {
          //         console.log(e);
          //     } 
          // }
  })
    }, 3000);

    this.setHistory()
    console.log('inmount'+this.setHistory());
    // console.log(this.connected);
      let currentPath = this.$route.matched[0].path
       const ionRouter = useIonRouter();
      //  console.log(currentPath);
        
      document.addEventListener('ionBackButton', (ev) => {
        this.setHistory()
        ev.detail.register(10, () => {
        

          if((this.exitapp)){
            console.log('exit');
            App.exitApp();
            navigator['app'].exitApp();
          }else{
          if(currentPath == '/vodstreams/:streamId/:sname/:fname'){
              this.$router.replace({ path: '/stream/vod' })
           }

          if(currentPath == '/livestreams/:streamId'){
              this.$router.replace({ path: '/stream/live' })
           }

          if(currentPath == '/stream/vod'){
              this.$router.replace({ path: '/stream/live' })
           }
          }
          
        

        });
      });
    	try {
       await userServices.getUserdata().then(result => {
         this.profileName = result.name
         if(result.ottAppPoster){
          this.ottPoster = 'https://assets.castr.io/ottAppPosters/'+result.ottAppPoster
         }else{
           this.ottPoster = 'https://castr.io/wp-content/uploads/2020/04/Castr_main_logo_black.svg'
         }
         console.log(this.ottAppPoster);
       });
      } catch(err) {
      console.log(err);
      }
	},
  methods: {
    beforeTabChange(e){
      this.activeMenu = e.tab
    },
    setHistory(){
      let currentRoute = this.$route.name 
      if(currentRoute == 'LivestreamManage'){
        this.exitapp = false
      }
      if(currentRoute == 'VODBucketManage'){
        this.exitapp = false
      }
      if(currentRoute == 'Stream'){
        this.exitapp = true
      }
      return this.exitapp
    }
 
  }
};

</script>

<style scoped>
ion-toolbar {
    --min-height: unset;
    --background: transparent;
    margin-bottom: 16px;
}
.content-inner{
    justify-content: flex-start;
    padding: 0px 20px;
    max-width: 991px;
    margin: 0 auto;
}
ion-header{
    margin-top: 13px;
}
ion-title{
    line-height: 1;
}

ion-tab-button.tab-selected ion-label{
    color: var(--ion-color-light);
}
ion-tab-button{
    padding: 10px 0px;
}
ion-tab-bar{
    min-height: 60px;
    --background: var( --ion-color-secondary);
    margin-left: -20px;
    margin-right: -20px;
}
ion-tab-button img{
    width: 22px;
    margin-bottom: 4px;
}
ion-tab-button.tab-selected img{
   filter: brightness(0) invert(1);
}
.main-content{
    order: -1;
    overflow-y: auto;
}

.main-content::-webkit-scrollbar {
    display: none;
}

ion-title{
  width: auto;
}
.header-ios ion-toolbar:last-of-type {
    --border-width: 0px;
    border: 0px !important;
}
.no-internet{
  text-align: center;
      height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.no-internet h2{
  margin-bottom: 7px;
  margin-top: 20px;
}
.no-internet ion-thumbnail{
  width: 205px;
  height: 136px;
}
.no-internet-btn{
  color: #fff;
  background: var(--ion-color-text-7);
  font-weight: 500;
  font-size: 17px;
  padding: 12px 0px;
  width: 103px;
  margin: 0 auto;
  text-align: center;
  box-shadow: 0px 12px 16px rgba(0, 0, 0, 0.06), 0px 2px 2px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.12), inset 0px 0.5px 0px rgba(255, 255, 255, 0.16);
border-radius: 6px;
display: block;
}
</style>