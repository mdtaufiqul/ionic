<template>
  <base-layout
    :show-header="false"
    :show-footer="false"
    :show-padding="false"
  >
    <template #content>
      <div
        v-show="!processing"
        class="iframe-wrapper"
      >
        <div v-html="iframecode" />
      </div>
      <div
        v-show="processing"
        class="loader"
      >
        <ion-spinner name="crescent" />
      </div>
    </template>
  </base-layout>
</template>

<script>
import {  IonPage, IonContent, IonItem,IonSpinner} from '@ionic/vue';

export default({
      components: {
        IonContent,
        IonPage, IonItem,IonSpinner
        },
    setup() {
       
    },
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
      streamIframeCode() {
			const embedUrl = `https://player.castr.com/${this.streamId}`;
			const htmlCode = `<iframe src="${embedUrl}" frameborder="0" scrolling="no" allow="autoplay" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>`;
			return htmlCode;
		},
    iframeLoaded(){
      console.log('iframe loaded');
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
