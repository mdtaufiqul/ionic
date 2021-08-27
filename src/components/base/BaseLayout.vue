<template>
  <ion-page>
    <ion-content @ionRefresh="doRefresh($event)">
      <ion-refresher slot="fixed">
        <ion-refresher-content />
      </ion-refresher>
      <div
        v-if="connected"
        class="content-inner"
      >
        <ion-tabs
          :class=" showPadding ? 'base-padding' : 'ion-no-padding' "
          @ionTabsWillChange="beforeTabChange"
        >
          <ion-header v-if="showHeader && !checkIsLoading">
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
              :isRefreshing="isRefreshing"
            />
          </div>
          <!-- Footer Slide Start -->
          <ion-tab-bar
            v-if="showFooter && !checkIsLoading"
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
import { chevronDownCircleOutline } from 'ionicons/icons'
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
  useIonRouter,
  IonRefresher, IonRefresherContent 
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
  IonThumbnail,
  IonRefresher,
  IonRefresherContent 
  },
  props: [ "pageTitle", "showHeader", "showFooter", "showPadding" ], 
    setup() {
      
  },
  data() {
      return {
          activeMenu: 'live',
          ottPoster: null,
          profileName: null,
          exitapp: true,
          connected: navigator.onLine,
          timer: 0
      }
  },
   computed: {
    isRefreshing() {
        return this.$store.state.isRefreshing;
    },
      checkIsLoading() {
        return this.$store.state.isLoading;
    }
  },
	watch: {
		async connected () {
			// overwrite url if load balancer enabled
		   if(this.connected){
             try {
                  await this.$store.dispatch('loadStreams')
              } catch (e) {
                  console.log(e);
              } 
          }
		},
	},
  async mounted() {
    clearInterval(this.timer)
    this.timer = 0
      this.timer = setInterval(async () => {
       Promise.resolve(await userServices.checkOnlineStatus()).then(async (result)=>{
          this.connected = result
  })
    }, 4000);
    
    this.setHistory()
      let currentPath = this.$route.matched[0].path
       const ionRouter = useIonRouter();
      document.addEventListener('ionBackButton', (ev) => {
        this.setHistory()
        ev.detail.register(10, () => {
        

          if((this.exitapp)){
            App.exitApp();
            navigator['app'].exitApp();
          }else{
          if(currentPath == '/vodstreams/:streamId/:sname/:fname'){
              this.$router.replace({ path: '/stream/vod' })
           }

          if(currentPath == '/livestreams/:streamId'){
              this.$router.replace({ path: '/stream/live' })
           }

          if(this.$route.fullPath == '/stream/vod'){
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
       });
      } catch(err) {
      console.log(err);
      }
	},
  methods: {
    async doRefresh(CustomEvent) {
        await this.$store.dispatch('loadStreams', false)
        CustomEvent.target.complete();
        console.log('refreshing')
    },
    beforeTabChange(e){
      this.setHistory()
      clearInterval(this.timer)
      this.timer = 0
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
      if(this.$route){
        if(this.$route.fullPath == '/stream/vod'){
            this.exitapp = false
        }
        if(this.$route.fullPath == '/stream/live'){
            this.exitapp = true
        }
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
    z-index: 9;
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