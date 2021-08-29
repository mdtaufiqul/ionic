<template>
  <base-layout
    :show-header="false"
    :show-footer="false"
    :show-padding="false"
  >
    <template #content="slotProps">
      <div
        v-if="!processing && !slotProps.isRefreshing"
        class="iframe-wrapper"
      >
        <!-- ==Back Button== -->
        <div
          class="stream-navigation"
        >
          <ion-buttons
            slot="start"
            class="back-button"
            @click="gotoStream"
          >
            <img
              src="@/assets/images/left-arrow.svg"
              alt="Back"
            >Back
          </ion-buttons>
        </div>
        <div v-html="iframecode" />
      </div>
      <div
        v-else
        class="loader"
      >
        <ion-spinner name="crescent" />
      </div>
    </template>
  </base-layout>
</template>

<script>
import {  IonPage, IonContent, IonItem,IonSpinner, IonButtons} from '@ionic/vue';

export default({
    components: { IonButtons,IonContent,IonPage,IonItem,IonSpinner },
    data() {
        return {
            streamId: null,
            iframecode: null,
            processing: false
        }
    },
    mounted() {
      this.processing= true
      		setTimeout(() => {
		this.processing= false
			}, 3000);
        let packageId = this.$route && this.$route.params.streamId
        this.streamId = packageId;
        this.iframecode = this.streamIframeCode()
    },
    methods: {
      gotoStream(){
        this.$router.replace({ path: '/stream/live' })
        return
      },
      streamIframeCode() {
			const embedUrl = `https://player.castr.com/${this.streamId}`;
			const htmlCode = `<iframe src="${embedUrl}" frameborder="0" scrolling="no" allow="autoplay" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>`;
			return htmlCode;
		},
    iframeLoaded(){
      
    }
    }
})
</script>

<style scoped>
 iframe{
    height: 515px;
    width: 100%;
 }
 /* .iframe-wrapper{
   margin-top: 20px;
 } */
 ion-item::part(.input-wrapper){
   display: block;
 }
 .loader {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
ion-spinner {
    --color: #fff;
}
</style>
