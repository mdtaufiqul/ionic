<template>
  <ion-col
    v-if="stream"
    size="12"
    class="ion-no-padding"
  >
    <ion-card class="ion-no-margin">
      <img
        src="@/assets/images/stream-demo.png"
        alt="ABC Church"
      >
      <ion-card-content class="fw-500 text-s-xl">
        {{ stream.name }}
      </ion-card-content>
    </ion-card>
  </ion-col>
</template>

<script>
import { defineComponent } from 'vue';
import {  IonCard, IonCardContent, IonCol
} from '@ionic/vue';

export default defineComponent({
  components: { IonCard, IonCardContent, IonCol}, 
  props: { 
      stream: {
          type: Object,
			required: true,
			validator: function(value) {
				return Object.prototype.hasOwnProperty.call(value, 'id');
			}
      }
  },
  data () {
    return {
    }
  },
  methods: {
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
}

ion-card img{
    width: 100%;
}

ion-card-content{
    padding: 16px 25px;
}

ion-item{
    display: flex;
    flex-direction: column;
    width: 100%;
}
</style>