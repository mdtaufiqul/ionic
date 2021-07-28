<template>
  <ion-col
    size="12"
    class="ion-no-padding"
  >
    <!-- For livestream -->
    <div v-show="streamCategory == 'live'">
      <ion-item
        @click="navigateManage"
      >
        <ion-card
          v-show="(streamStatus == 'livestream' ? streamAlive : !streamAlive)"
          class="ion-no-margin"
        >
          <ion-badge :color="streamAlive ? 'success' : 'text-5'">
            {{ streamAlive ? 'Live' : 'Offline' }}
          </ion-badge>
          <stream-thumb
            :stream="stream"
            :media-pulse="mediaPulse"
            class="video-thumb"
          />
          <ion-card-content class="fw-500 text-s-xl">
            {{ stream.name }}
          </ion-card-content>
        </ion-card>
      </ion-item>
    </div>
    <!-- For VOD -->
    <div v-show="streamCategory == 'vod'">
      <ion-item
        v-show="showFolder"
        @click="folderClick"
      >
        <ion-text class="d-flex ion-justify-content-start ion-align-items-center color-text-2 text-s-m text-capitalize folder-single">
          <img
            src="@/assets/images/folder-filled.svg"
            alt="ABC Church"
            class="fw-500 text-s-xl "
          ><span>{{ stream.name }}</span>
        </ion-text>
      </ion-item>

      <!-- <ion-item
        v-for="voditem in stream.allvideos"
        v-else
        :key="voditem.id"
      >
        <vod-single
          :voditem="voditem"
          :stream="stream"
        />
      </ion-item> -->
    </div>
  </ion-col>
</template>

<script>
import { defineComponent } from 'vue';
import StreamThumb from '@/components/stream/StreamThumb.vue';
import {  IonCard, IonCardContent, IonCol, IonText, IonItem, IonBadge
} from '@ionic/vue';
import userServices from '@/services/services';

export default defineComponent({
  components: { IonCard, IonCardContent, IonCol, IonText, userServices, StreamThumb, IonItem, IonBadge}, 
  props: { 
        stream: {
          type: Object,
			required: true
      },
      streamStatus: {
          type: String,
          default: 'livestream'
      },
      showFolder: {
          type: Boolean,
          default: false
      },
      streamCategory: {
          type: String,
          default: 'live'
      }
  },
  data () {
    return {
      scopeAlive: true,
      mediaPulseTimeoutCtrl: null,
      streamStat: this.stream.enabled,
      mediaPulse: this.stream.mediapulse
    }
  },
  computed:{
    streamAlive() {
          return this.streamStat && this.mediaPulse && this.mediaPulse.alive;
        },
  },
  mounted() {
  // if (this.stream.type !== 'vod') {
  //   	setTimeout(() => {
	// 			this.subscribeMediaPulse();
	// 		}, 1500);
	// 	}
  this.subscribeMediaPulse();
  },
  unmounted() {
		this.scopeAlive = false;
		this.unsubscribeMediaPulse();
	},
  methods: {
    navigateManage() {
        // let viewName = 'ChannelManage'
        let viewName = 'LivestreamManage';
        this.$router.push({
            name: viewName,
            params: { streamId: this.stream.key }
        });
    },
    subscribeMediaPulse() {
			const streamKey = this.stream.key;
			const self = this;
			(async function loop() {
				if (!self.scopeAlive) return;

				let timeoutInterval = 5000;
				let shouldUpdatePulse = self.stream.enabled;
				if (shouldUpdatePulse && document.hidden) {
					shouldUpdatePulse = false;
					timeoutInterval = 6000;
				}

				if (shouldUpdatePulse) {
					if (!document.hasFocus()) {
						timeoutInterval = 14000;
					}
				}

      
				if (shouldUpdatePulse) {
					try {
						const pulseObject = await userServices.getStreamMediaPulse(
							streamKey
						);
						self.onMediaPulse(pulseObject);
					} catch (e) {}
				}

				// reschedule
				self.mediaPulseTimeoutCtrl = setTimeout(
					loop.bind(this),
					timeoutInterval
				);
			}());
		},
    onMediaPulse(pulse = {}) {
			this.mediaPulse = pulse;
			this.$emit('pulse-update', this.stream.id, pulse);
		},
    unsubscribeMediaPulse() {
			clearTimeout(this.mediaPulseTimeoutCtrl);
		},
    folderClick() {
      this.$emit('folderClicked', this.stream.name);
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
ion-text{
    width: 100%;
    display: flex;
}
ion-badge{
  color: var( --ion-color-light);
      position: absolute;
    z-index: 9;
    top: 8px;
    left: 8px;
    border-radius: 4px;
    padding: 2px 6px;
}
</style>