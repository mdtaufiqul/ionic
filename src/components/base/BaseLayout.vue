<template>
  <ion-page>
    <ion-content>
      <div
        v-if="!checkIsLoading"
        class="content-inner"
      >
        <ion-tabs
          class="base-padding"
          @ionTabsWillChange="beforeTabChange"
        >
          <ion-header>
            <ion-toolbar>
              <ion-buttons
                slot="start"
                class="ion-no-margin"
              >
                <ion-title class="text-s-xxl fw-500 ion-no-padding color-light">
                  {{ (activeMenu == 'live') ? 'Stream' : 'VOD' }}
                </ion-title>
              </ion-buttons>
              <ion-item slot="end">
                <slot name="profile" />
              </ion-item>
            </ion-toolbar>
          </ion-header>
          <div class="main-content">
            <slot
              name="content"
              :activeMenu="activeMenu"
            />
          </div>
          <ion-tab-bar slot="bottom">
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
        </ion-tabs>
      </div>
      <div
        v-else
        slot="fixed"
        class="initial-page"
      >
        <div class="castr-image">
          <img
            src="@/assets/images/demo_poster.png"
            alt="ABC Church"
          >
        </div>
        <div class="castr-spinner">
          <ion-spinner
            name="circles"
            color="primary"
          />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
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
  IonSpinner
} from "@ionic/vue";


export default {
  components: {
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
  IonSpinner
  },
  props: ["pageTitle"],
  data() {
      return {
          activeMenu: 'live',
      }
  },
  computed: {
    checkIsLoading() {
        return this.$store.state.isLoading;
    }
  },
  async mounted() {
  
	},
  methods: {
    beforeTabChange(e){
      this.activeMenu = e.tab
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
    margin-top: 16px;
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

.initial-page{
    background: var(--ion-color-light);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}
.castr-spinner{
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
}

ion-title{
  width: auto;
}
.header-ios ion-toolbar:last-of-type {
    --border-width: 0px;
    border: 0px !important;
}
</style>