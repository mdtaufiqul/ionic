<template>
  <base-layout
    :show-header="false"
    :show-footer="false"
    :show-padding="false"
  >
    <template #content="slotProps">
      <ion-page>
        <ion-content class="ion-no-padding">
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
              >
            </ion-buttons>
          </div>
          <div
            v-show="!processing"
            class="vod-single-wrapper"
          >
            <div class="iframe-wrapper">
              <iframe
                v-show="!iframeProcessing"
                id="embed"
                :src="eUrl"
                frameborder="0"
                width="500"
                height="380"
                allow="autoplay"
                scrolling="no"
                allowfullscreen
                webkitallowfullscreen
                mozallowfullscreen
                oallowfullscreen
                msallowfullscreen
                data-isloaded="0"
              />
            </div>
            <ion-item class="ion-no-border">
              <div class="video-info">
                <ion-text
                  color="light"
                  class="video-title"
                >
                  {{ title }} 
                </ion-text>
                <div class="profile-info">
                  <ion-thumbnail
                    slot="end"
                    class="image-small"
                  >
                    <img
                      :src="slotProps.posterUrl"
                      :alt="slotProps.profileName"
                    >
                  </ion-thumbnail>
                  <ion-text color="medium">
                    <h3 class="ion-no-margin text-s-s">
                      {{ slotProps.profileName }}
                    </h3>
                  </ion-text>
                </div>
              </div>
            </ion-item>
            <ion-item>
              <div class="folder-info">
                <img
                  src="@/assets/images/folder.png"
                  alt="Folder"
                >
                <ion-text
                  color="light"
                  class="video-folder-name"
                >
                  {{ folder }}
                </ion-text>
              </div>
            </ion-item>
            <div
              v-if="!processing"
              class="vod-content"
            >
              <ion-item
                class="ion-no-border ion-no-padding no-scrollbar related-list"
              >
                <ion-grid class="ion-no-padding">
                  <ion-row>
                    <vod-single
                      v-for="stream in otherStreams"
                      :key="stream.id"
                      :voditem="stream"
                      @refresh="refresh"
                    />
                  </ion-row>
                </ion-grid>
              </ion-item>
            </div>
          </div>
          <div
            v-show="processing"
            class="loader"
          >
            <ion-spinner name="crescent" />
          </div>
        </ion-content>
      </ion-page>
    </template>
  </base-layout>
</template>

<script>
import {  IonPage, IonContent, IonItem, IonText, IonThumbnail,IonGrid, IonRow, IonSpinner } from '@ionic/vue';
import vodSingle from '@/components/stream/vodSingle.vue';

export default({
      components: {
        IonContent,
        IonPage, IonItem, IonText, IonThumbnail, IonGrid, IonRow, vodSingle, IonSpinner 
        },
    data() {
        return {
            eUrl: null,
            title: '',
            folder: '',
            otherStreams: [],
            processing: false,
            iframeProcessing: false
        }
    },
    computed: {
    streamarray() {
        return this.$store.state.streamarray;
    }
  },
  watch: {
    streamarray(){  
      if(this.$store.state.streamarray.allvideos){
        this.processing = true
        let video = this.findVideodetails(this.eUrl);
        this.otherStreams = this.findvideos(this.folder, this.eUrl)
        this.processing = false
      }
    }
},
  async created() {
    try {
        await this.$store.dispatch('loadStreams',false);
    } catch (e) {
        console.log(e);
    } 
},
    mounted() {
      this.processing = true
      let url = this.$route && this.$route.params.streamId
      this.eUrl = url
      this.title = this.$route && this.$route.params.sname
      this.folder = this.$route && this.$route.params.fname
   
    },
    methods: {
        gotoStream(){
        this.$router.replace({ path: '/stream/vod' })
      },
      checkIframeloading(){
        let element = document.getElementById('embed');
      },
      refresh(value){
        this.processing = true
        this.iframeProcessing = true
        this.eUrl = value.url
        setTimeout(() => {
          this.iframeProcessing = false
        },2500 );
        
        this.title = value.name
        this.folder = value.folder
        let video = this.findVideodetails(value.eUrl);
        this.otherStreams = this.findvideos(this.folder, this.eUrl)
        this.processing = false
      },
      getVOD(){
        return this.otherStreams
      },
    findVideodetails(url) {
        let video =  this.streamarray.allvideos.find(function(s) { return s.embedUrl == url })
        return video
		},
    findvideos(folder, url){
      let videos =  this.streamarray.allvideos.filter(function(s) { return (s.foldername.toLowerCase() == folder.toLowerCase()) && (s.embedUrl != url) })
      return videos
    }
    }
})
</script>

<style scoped>
 iframe{
    height: 210px;
    width: 100%;
    background: #000;
 }
 .video-info {
    width: 100%;
    background: var(--ion-color-secondary);
    padding: 16px 20px;
    min-height: 83px;
    margin-bottom: 20px;
}
.iframe-wrapper{
  background: #000;
  height: 210px;
}
.profile-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 8px;
}

.profile-info ion-thumbnail {
    margin-left: 0;
    margin-right: 8px;
}
 ion-item::part(.input-wrapper){
   display: block;
 }
 ion-text.video-title {
    font-size: 20px;
    line-height: 24px;
    font-weight: 600;
    text-transform: capitalize;
}

ion-text.video-folder-name {
    font-weight: 500;
    font-size: 16px;
    text-transform: capitalize;
}

.folder-info img {
    height: 15px;
    margin-right: 9.5px;
}

.folder-info {
    margin-bottom: 10px;
}
.related-list, .folder-info{
  padding-left: 20px;
  padding-right: 20px;
}
ion-spinner {
    --color: #fff;
}

.loader {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
.vod-single-wrapper {
    overflow: scroll;
    height: 100%;
}
</style>
