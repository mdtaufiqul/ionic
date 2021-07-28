<template>
  <ion-card
    class="ion-no-margin vod-file-lists"
    @click="navigateVOD"
  >
    <div class="card-left">
      <img
        src="@/assets/images/play.svg"
        alt="ABC Church"
      >
    </div>
    <ion-card-content class="ion-justify-content-start ion-align-items-start ">
      <ion-text
        color="light"
        class="fw-500 text-s-xl text-capitalize"
      >
        {{ (voditem.fileName.length > 15) ? voditem.fileName.substring(0,15)+".." : voditem.fileName }}
      </ion-text>
      <ion-text class="ion-align-items-center">
        <img
          src="@/assets/images/folder.png"
          alt="ABC Church"
          class="fw-500 text-s-xl "
        >
        {{ (voditem.foldername.length > 20) ? voditem.foldername.substring(0,20)+".." : voditem.foldername }}
      </ion-text>
    </ion-card-content>
  </ion-card>
</template>

<script>
import { defineComponent } from 'vue';
import {  IonCard, IonCardContent, IonText
} from '@ionic/vue';

export default defineComponent({
  components: { IonCard, IonCardContent,  IonText}, 
  props: { 
        voditem: {
          type: Object,
			required: true
      },
    //     stream: {
    //       type: Object,
	// 		required: true
    //   }
  },
  data () {
    return {
    }
  },
  computed:{
  },
  mounted() {
    //   console.log(this.voditem);
  },
  methods: {
   navigateVOD(){
     console.log(this.voditem.fileName);
      let viewName = 'VODBucketManage';
       this.$router.push({
            name: viewName,
            params: { streamId: this.voditem.embedUrl,   sname: this.voditem.fileName,
                fname: this.voditem.foldername },
        });
        this.$emit('refresh', {
          url: this.voditem.embedUrl,
          name: this.voditem.fileName,
          folder: this.voditem.foldername
        })
   }
  }
});
</script>

<style scoped>
ion-card{
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    --background: var(--ion-color-secondary);
    --color: var(--ion-color-light);
    margin-bottom: 16px;
    box-shadow: none;
    cursor: pointer;
}

ion-card.vod-file-lists{
    display: flex;
    border-radius: 6px;
}

ion-card img{
    width: 100%;
}

ion-card-content{
    padding: 16px 25px;
}
ion-card.vod-file-lists ion-card-content{
    padding: 16px;
    width: 100%;
}

ion-item{
    display: flex;
    flex-direction: column;
    width: 100%;
}

.vod-file-lists ion-card-content img{
    max-width: 17px;
    margin-right: 9.5px;
}
.vod-file-lists ion-card-content{
    display: flex;
    flex-direction: column;
}
.vod-file-lists .card-left{
    min-width: 80px;
    height: 80px;
    background: var(--ion-color-text-4);
    display: flex;
    align-items: center;
    justify-content: center;
}
.vod-file-lists .card-left img{
    width: 20px;
}
ion-text{
    width: 100%;
    display: flex;
}
</style>