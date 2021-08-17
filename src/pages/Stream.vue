<template>
  <base-layout
    :show-header="true"
    :show-footer="true"
    :show-padding="true"
  >
    <template #content="slotProps">
      <!-- Loading Slide -->
      <div
        v-if="checkIsLoading"
        slot="fixed"
        class="initial-page"
      >
        <div
          v-if="slotProps.posterUrl"
          class="castr-image"
        >
          <img
            :src="slotProps.posterUrl"
            :alt="slotProps.profileName"
          >
        </div>
        <div class="castr-spinner">
          <ion-spinner
            name="circles"
            color="primary"
          />
        </div>
      </div>
      <!-- Loading Slide Ends -->
      <div else="!checkIsLoading">
        <ion-searchbar
          v-if="!showFolder"
          ref="searchWidgetInputElement"
          v-model="searchWidgetInput"
          :placeholder="(slotProps.activeMenu == 'live') ? 'Searching for Stream...' : 'Searching for VOD...'"
          color="secondary"
          class="ion-no-padding"
          @ionFocus="onSearchWidgetFocus"
          @ionBlur="onSearchWidgetBlur"
        />
        <div
          v-else
          class="navigation"
        >
          <ion-buttons
            slot="start"
            class="back-button"
            @click="showFolder = false"
          >
            <img
              src="@/assets/images/left-arrow.svg"
              alt="Back"
            >
          </ion-buttons>
          <ion-text>Folder</ion-text>
        </div>
        <ion-segment
          v-show="slotProps.activeMenu == 'live'"
          :value="activeTab"
          @ionChange="segmentChanged($event)"
        >
          <ion-segment-button
            value="livestream"
            class="ion-no-margin"
          >
            <ion-label class="color-text-1 fw-500 text-s-s text-capitalize">
              Livestream
            </ion-label>
          </ion-segment-button>
          <ion-segment-button
            value="offline"
            class="ion-no-margin"
          >
            <ion-label class="color-text-1 fw-500 text-s-s text-capitalize">
              Offline
            </ion-label>
          </ion-segment-button>
        </ion-segment>
        <div v-show="(slotProps.activeMenu == 'vod') && !showFolder">
          <ion-item
            class="vod-nav"
          >
            <ion-select
              :interface-options="customActionSheetOptions"
              interface="action-sheet"
              placeholder="Sort by Newest"
              class="text-s-m fw-400"
              name="sort"
              value="newest"
              @ionChange="sortVod"
            >
              <ion-select-option value="newest">
                Sort by Newest
              </ion-select-option>
              <ion-select-option value="oldest">
                Sort by Oldest
              </ion-select-option>
              <ion-select-option value="atoz">
                A to Z
              </ion-select-option>
              <ion-select-option value="ztoa">
                Z to A
              </ion-select-option>
            </ion-select>
        
            <ion-grid class="ion-no-padding folder">
              <ion-row
                class="folder-menu ion-justify-content-center ion-align-items-center ion-no-margin"
                @click="folderView"
              >
                <img
                  src="@/assets/images/folder.png"
                  alt="Folder"
                >
                <ion-label
                  color="light"
                  class="text-s-m fw-400"
                >
                  Folder
                </ion-label>
              </ion-row>
            </ion-grid>
          </ion-item>
   
          <ion-item
            class="ion-no-border ion-no-padding no-scrollbar"
          >
            <ion-grid class="ion-no-padding">
              <ion-row v-if="getVOD().length > 0">
                <div
                  v-if="searchFolder"
                  class="query-folder-name"
                >
                  Folder: <span>{{ searchFolder }}</span>
                </div>
                <vod-single
                  v-for="stream in getVOD()"
                  :key="stream.id"
                  :voditem="stream"
                />
              </ion-row>
              <ion-row v-else>
                <ion-text class="no-stream">
                  <img
                    src="@/assets/images/no-stream.svg"
                    alt="Back"
                  >
                  <h2 class="ion-no-margin color-text-2 text-xs-custom text-500">
                    There is no {{ (slotProps.activeMenu == 'live') ? 'Stream' : 'VOD' }} here
                  </h2>
                  <p
                    class="color-text-6 text-s-m"
                  >
                    Maybe come back later.
                  </p>
                </ion-text>
              </ion-row>
            </ion-grid>
          </ion-item>
        </div>
        <ion-item
          v-if="showFolder"
          @click="showFolder=!showFolder"
        >
          <ion-text class="ion-justify-content-start ion-align-items-center color-text-2 text-s-m text-capitalize folder-single pt-0">
            <img
              src="@/assets/images/grid.svg"
              alt="All Files"
              class="fw-500 text-s-xl "
            ><span>All file</span>
          </ion-text>
        </ion-item>

        <ion-item
          v-show="(slotProps.activeMenu == 'live') || ((slotProps.activeMenu == 'vod') && showFolder)"
          class="ion-no-border ion-no-padding no-scrollbar"
        >
          <ion-grid class="ion-no-padding">
            <ion-row v-if="((activeTab == 'livestream' ? countedStream.live : countedStream.offline) > 0) || showFolder">
              <single-stream
                v-for="stream in filterStream(slotProps.activeMenu)"
                :key="stream._id"
                :stream="stream"
                :stream-status="activeTab"
                :stream-category="slotProps.activeMenu"
                :show-folder="showFolder"
                @folder-clicked="findFolderstream"
                @is-live="countStream(slotProps.activeMenu)"
              />
            </ion-row>
            <ion-row v-else>
              <ion-text class="no-stream">
                <img
                  src="@/assets/images/no-stream.svg"
                  alt="Back"
                >
                <h2 class="ion-no-margin color-text-2 text-xs-custom text-500">
                  There is no {{ (slotProps.activeMenu == 'live') ? 'Stream' : 'VOD' }} here
                </h2>
                <p
                  v-if="activeTab == 'livestream'"
                  class="color-text-6 text-s-m"
                >
                  Maybe the stream you’re looking for is not live yet. Visit <span @click="activeTab = 'offline'">Offline page</span> for a check.
                </p>
                <p
                  v-else
                  class="color-text-6 text-s-m"
                >
                  Maybe come back later.
                </p>
              </ion-text>
            </ion-row>
          </ion-grid>
        </ion-item>
      </div>
    </template>
  </base-layout>
</template>

<script>
import {  
  IonItem, 
  IonThumbnail, IonLabel,
  IonText,IonSegment, IonSegmentButton, IonGrid, IonRow, IonSelect,
  IonSelectOption, 
  IonSearchbar,IonButtons,IonBackButton, IonSpinner
} from '@ionic/vue';
import singleStream from '../components/stream/singleStream';
import vodSingle from '@/components/stream/vodSingle.vue';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;
// import vodStream from '../components/stream/vodStream';
// import userServices from '@/services/services';
import _ from 'lodash';

export default({ 
  components: {  
    singleStream,IonSelect,IonButtons,
  IonSearchbar,
  IonSelectOption,IonSpinner,
    // vodStream,
    IonItem, 
  IonThumbnail, IonLabel,
  IonText ,IonSegment, IonSegmentButton, IonGrid, IonRow, vodSingle,IonBackButton, Plugins, App },
  data () {
    return {
      activeTab: 'livestream',
      showFolder: false,
      streams: null,
      videoList: null,
      sortBy: 'newest',
      rawStreams: [],
          searchWidgetInput: '',
          searchFolder: '',
          searchWidgetFocused: false,
          searchWidgetActive: false,
      customActionSheetOptions: {
      // header: 'Colors',
      // subHeader: 'Select your favorite color'
    },
    countedStream: {
      live: 0,
      offline: 0
    }
    }
  },
  computed: {
    streamarray() {
      console.log("done1");
        return this.$store.state.streamarray;
    },
    checkIsLoading() {
        return this.$store.state.isLoading;
    }
  },
watch: {
  streamarray(){
    console.log("done2");
    this.countStream('live')
    if(this.$store.state.streamarray.allvideos){
       this.changeSortBy('newest');
    }
  }
},
  async mounted() {
          document.addEventListener('ionBackButton', (ev) => {
        let currentPath = this.$route.matched[0].path
        ev.detail.register(9, () => {
          if(currentPath == '/stream/vod'){
              this.searchFolder = ''
           }
        });
      });
  },
    async created() {
    try {
        await this.$store.dispatch('loadStreams')
    } catch (e) {
        console.log(e);
    } 
},
  methods: {
    getVOD(){
      let vodlist = this.rawStreams
 	    const filteredVOD = vodlist.filter((s) => {
        let bool = s
				if (this.searchWidgetInput) {
					const searchStr = this.searchWidgetInput.toLowerCase();
					bool = s.fileName.toLowerCase().includes(searchStr);
				}
				if (this.searchFolder) {
					const searchFldr = this.searchFolder.toLowerCase();
					bool = s.foldername.toLowerCase().includes(searchFldr);
				}
				return bool;
				});
      return filteredVOD;
    },
    onSearchWidgetFocus() {
			this.searchWidgetFocused = true;
		},
		onSearchWidgetBlur() {
			this.searchWidgetFocused = false;
			setTimeout(() => {
				const blankSearchVal =
					!this.searchWidgetInput || !this.searchWidgetInput.length;
				if (
					this.searchWidgetActive &&
					blankSearchVal &&
					!this.searchWidgetFocused
				) {
					this.toggleSearchWidget();
				}
			}, 500);
		},
    toggleSearchWidget() {
    this.searchWidgetActive = !this.searchWidgetActive;
    this.$refs.searchWidgetInputElement.focus();
    if (!this.searchWidgetActive) {
      this.searchWidgetInput = '';
    }
     },
    changeSortBy(val) {
      
			this.rawStreams = _.isEmpty(this.rawStreams) ? this.streamarray.allvideos : this.rawStreams;
      let streamsSorted = null;
			if(val === 'atoz') {
				const lowerCaseStreams = this.streamarray.allvideos.map((item) => ({...item, lowerCaseName : _.lowerCase(item.fileName)}));
				streamsSorted = _.orderBy(lowerCaseStreams, ['lowerCaseName'],['asc']);
				this.rawStreams = streamsSorted
			}
			if(val === 'ztoa') {
				const lowerCaseStreams = this.streamarray.allvideos.map((item) => ({...item, lowerCaseName : _.lowerCase(item.fileName)}));
				const streamsSorted = _.orderBy(lowerCaseStreams, ['lowerCaseName'],['desc']);
				this.rawStreams = streamsSorted
			}
			if(val === 'newest') {
				const streamsSorted = _.orderBy(this.streamarray.allvideos, ['creationTime'],['desc']);
				this.rawStreams = streamsSorted
			}
			if(val === 'oldest') {
				const streamsSorted = _.orderBy(this.streamarray.allvideos, ['creationTime'],['asc']);
				this.rawStreams = streamsSorted
			}
      this.streamarray.allvideos == this.rawStreams
		},
    sortVod(e){
      let sortvalue = e.detail.value;
      this.changeSortBy(sortvalue);
    },
    segmentChanged(ev) {
      let activetab = ev.detail.value;
      console.log(activetab);
      this.activeTab = activetab
    },
     filterStream(cat, foldername = null) {
        if (this.streamarray && typeof this.streamarray === 'object') {
          console.log('here');
          console.log(this.streamarray.streams);
            const filteredStream = this.streamarray.streams.filter(single => {
                   let bool =  single.type == cat
                   if(bool && this.searchWidgetInput){
                  const searchStr = this.searchWidgetInput.toLowerCase();
                  bool = single.name.toLowerCase().includes(searchStr);
            }
            return bool;
            });
            
            return filteredStream
        }
        
      },
      findFolderstream(value){
        this.showFolder = false
        this.searchFolder = value
      },
      countStream(value){
          // this.countedStream.live++ 
          // this.countedStream.offline = (this.filterStream(value).length - this.countedStream.live)
          // console.log(this.countedStream);
          let sreamList = this.filterStream(value)
          let countlive = sreamList.filter(function(single){
            return single.enabled && single.mediapulse.alive
          });
          this.countedStream.live = countlive.length
          this.countedStream.offline = (sreamList.length - countlive.length)
          console.log('sreamList');
          console.log(this.countedStream);
      },
      folderView() {
        this.searchFolder = ''
        this.showFolder = !this.showFolder
      }
  }
});
</script>

<style>
.initial-page{
    background: var(--ion-color-light);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
}
.castr-spinner{
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
}
ion-thumbnail{
  width: 24px;
  height: 24px;
  border-radius: 100%;
  margin: 0px;
  margin-left: 8px;
  overflow: hidden;
}
ion-item{
  --min-height: unset;
  --inner-padding-end:0;
  --inner-margin:0px;
  --inner-border-width: 0px;
  --overflow: hidden;
}
ion-item::part(native) {
  overflow: hidden;
}
.searchbar-input-container .searchbar-input {
    padding: 3px 44px;
}
ion-segment{
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 24px;
  background: transparent;
  border-radius: 0px;
}
ion-segment-button{
  min-height: unset;
  border-bottom: 2px solid transparent;
  border-radius: 0px;
}
ion-segment-button.segment-button-checked{
  border-color:var(--ion-color-light);
  background: transparent;
}
.in-segment ion-label{
    margin: 0px 0px;
    padding: 13px 0px;
}
.segment-button-checked ion-label{
    color: var(--ion-color-light);
}
ion-item{
    max-width: 400px;
    margin: 0 auto;
}
.folder-menu img{
  max-width: 17px;
  margin-right: 9.5px;
}
ion-row.folder-menu{
  background: var(--ion-color-text-4);
  box-shadow: 0px 12px 16px rgba(0, 0, 0, 0.06), 0px 2px 2px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.12), inset 0px 0.5px 0px rgba(255, 255, 255, 0.08);
border-radius: 6px;
padding: 7.5px 23px;
position: relative;
    z-index: 9;
    cursor: pointer;
   width: 122px;
   margin-right: 0;
   margin-left: auto;
   height: 36px;
}
ion-select{
  background: var(--ion-color-text-4);
  --placeholder-color: var(--ion-color-light);
  --placeholder-opacity: 1;
  --padding-top: 9px;
  --padding-bottom: 9px;
  --padding-end: 15px;
  --padding-start: 40px;
  width: 100%;
  max-width: 100%;
  border-radius: 6px;
  color: var(--ion-color-light);
  position: relative;
  height: 36px;
}
ion-select:after{
  content: "";
  width: 14px;
  height: 14px;
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  background-image: url(../assets/images/sort.svg);
  background-size: cover;
}
ion-item::part(native) {
  overflow: hidden;
  padding: 0px;
}
/* .searchbar-search-icon{
    top: 8px !important;
  } */
ion-grid.folder{
  position: relative;
  z-index: 9;
  max-width: 31%;
  min-width: 130px;
  margin-left: auto;
  margin-right: 0;
}

ion-item.vod-nav{
  padding-top: 16px;
  padding-bottom: 24px;
}
.action-sheet-button span {
    color: #fff;
    justify-content: center !important;
}

.action-sheet-button.sc-ion-action-sheet-ios{
  background: var( --ion-color-primary);
  font-size: var(--font-s-l);
  padding: 5px 10px;

height: 40px;}
.action-sheet-group.sc-ion-action-sheet-ios{
  border-radius: 8px;
  overflow: hidden;
  background: var( --ion-color-primary);
}
</style>

<style scoped>
ion-grid{
  max-width: 100%;
}
ion-searchbar{
    --border-radius: 6px;
    --placeholder-font-weight: 400;
    --placeholder-color: var(--ion-color-text-3);
    --placeholder-opacity: 1;
    --color: var(--ion-color-light);
    --box-shadow: none;
    border: 1px solid transparent;
    overflow: hidden;
    height: 36px;
}
ion-searchbar.searchbar-has-focus{
   border-color: #2076FF;
   border-radius: 6px;
   caret-color: #2076FF;
}
.navigation {
    background: var( --ion-color-secondary);
    padding: 15px 10px;
    margin-left: -20px;
    margin-right: -20px;
    position: absolute;
    width: 100%;
    z-index: 99;
    top: 0;
    display: flex;
    align-items: center;
}
ion-buttons.back-button {
    padding: 3px 10px;
    cursor: pointer;
}
.navigation ion-text {
    color: #fff;
    font-weight: 500;
    font-size: var(--font-s-l);
    width: 100%;
    text-align: center;
    margin-left: -20px;
}
.no-stream{
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 65px;
}
.no-stream img{
  display: inline-block;
  margin-bottom: 24px;
}
.no-stream p{
margin-top: 7px;
}
.no-stream p>span{
 color: var(--ion-color-text-1);
 text-decoration: underline;
 cursor: pointer;
}
.castr-image img{
  width: 217px;
}
.query-folder-name {
    color: var(--ion-color-medium);
    font-size: var(--font-s-xs);
    font-weight: 500;
    margin-bottom: 8px;
}

.query-folder-name>span {
    color: #fff;
    text-transform: capitalize;
}
</style>