<template>
  <div>
    <div class="module-box text-center-mobile">
      <h3>{{ $t('Embed') }}</h3>
      <div class="d-flex flex-column align-items-center" v-if="!exclusive && authenticated">
        <div v-if="noAd" class="sticker" :title="$t('You cannot insert advertising')">
          {{ $t('No advertising') }}
        </div>
        <iframe
          :src="iFrameSrc"
          scrolling="no"
          frameborder="0"
          :width="iFrameWidth"
          :height="iFrameHeight"
        ></iframe>
        <div class="d-flex flex-column">
          <button class="btn mb-3" @click="isShareModal = true;">
            {{ $t('Share') }}
          </button>
          <select v-model="iFrameModel" class="frame-select">
            <option value="default">{{$t('Default version')}}</option>
            <option value="large">{{$t('Large version')}}</option>
            <option value="emission" v-if="podcast && podcast.podcastId">{{$t('Emission version')}}</option>
            <option value="largeEmission" v-if="podcast && podcast.podcastId">{{$t('Large emission version')}}</option>
            <option value="largeSuggestion" v-if="podcast && podcast.podcastId">{{$t('Large suggestion version')}}</option>
          </select>
        </div>
        <div class="d-flex align-items-center mt-3" v-if="!podcast || iFrameModel === 'emission' || iFrameModel === 'largeEmission' || iFrameModel === 'largeSuggestion'">
          <span>{{ $t('Show') }}</span>
          <input
            type="number"
            v-model="iFrameNumber"
            min="1"
            max="10"
            class="input-share-player input-no-outline text-center m-2"
          />
          <span>{{ $t('Last podcasts') }}</span>
        </div>
      </div>
      <div v-if="exclusive && authenticated">
        {{ $t('Only organisation members can share the content') }}
      </div>
      <div v-if="!authenticated">
        {{ $t('Only authenticated members can share the content') }}
      </div>
    </div>
    <ShareModal 
      v-if="isShareModal" 
      @close='isShareModal=false;'
      :embedLink='iFrame'
      :embedlyLink='iFrameSrc'
      :directLink='podcast'
    ></ShareModal>
  </div>
</template>

<style lang="scss">
@import '../../../sass/_variables.scss';

.input-share-player{
  border: 1px solid #ddd;
  border-radius: 50px;
  input[type=number]{
    margin: 0 1rem;
    width: 100px;
  }
}
.sticker{
  align-self:center;
  background:rgba($octopus-primary-color, 0.3);
  padding:0.5rem;
  transition:all .5s ease;
  color:#41403E;
  letter-spacing:1px;
  outline:none;
  box-shadow: 10px 10px 34px -15px hsla(0,0%,0%,.4);
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  border:solid 2px #41403E;
    &:hover{
      box-shadow:2px 8px 4px -6px hsla(0,0%,0%,.3);
  } 
}
</style>

<script>
import ShareModal from '../../misc/modal/ShareModal.vue';
import {state} from "../../../store/paramStore.js";

export default {
  props: ['podcast', 'emissionId', "organisationId", 'exclusive'],

  components:{
    ShareModal
  },

  data() {
    return {
      iFrameModel:'default',
      iFrameNumberPriv: '3',
      isShareModal: false,
    };
  },
  computed: {
    noAd(){
      if(this.podcast && this.podcast.organisation.id !== this.organisationId && this.podcast.monetisable === 'NO' || (this.podcast && this.podcast.monetisable === 'UNDEFINED' && this.podcast.emission.monetisable === 'NO')){
        return true;
      } else{
        return false;
      }
      
    },
    authenticated(){
      return state.generalParameters.authenticated;
    },
    iFrameSrc() {
      let url = "";
      if(!this.podcast){
        if(this.iFrameModel === 'default'){
          url =  `${state.podcastPage.MiniplayerUri}miniplayer/emission/${this.emissionId}/${this.iFrameNumberPriv}`;
        } else{
          url = `${state.podcastPage.MiniplayerUri}miniplayer/emissionLarge/${this.emissionId}/${this.iFrameNumberPriv}`;
        }
      }else {
        if (this.iFrameModel === 'emission' || this.iFrameModel === 'largeEmission') {
          url = `${state.podcastPage.MiniplayerUri}miniplayer/${this.iFrameModel}/${this.emissionId}/${this.iFrameNumberPriv}/${this.podcast.podcastId}`;
        } else if(this.iFrameModel === 'largeSuggestion'){
          url = `${state.podcastPage.MiniplayerUri}miniplayer/${this.iFrameModel}/${this.podcast.podcastId}/${this.iFrameNumberPriv}`;
        }else {
          url = `${state.podcastPage.MiniplayerUri}miniplayer/${this.iFrameModel}/${this.podcast.podcastId}`;
        }
      }
      return url + '?distributorId=' + this.organisationId;
    },

    iFrameNumber: {
      get() {
        return this.iFrameNumberPriv;
      },
      set(value) {
        let val = parseInt(value, 10);
        if (!isNaN(val) && val >= 1 && val <= 10) {
          this.iFrameNumberPriv = value;
        }
      },
    },

    iFrameWidth() {
      return '100%';
    },

    iFrameHeight() {
      switch (this.iFrameModel) {
        case 'large':
          if(this.podcast){
            return '180px';
          } else{
            switch(this.iFrameNumberPriv){
              case "1": return '185px';
              case "2": return '240px';
              case "3": return '290px';
              case "4": return '345px';
              case "5": return '390px';
              default: return '435px';
            }
          }
        case 'largeEmission':
        case 'largeSuggestion':
          switch(this.iFrameNumberPriv){
            case "1": return '260px';
            case "2": return '315px';
            case "3": return '365px';
            case "4": return '420px';
            case "5": return '465px';
            default: return '510px';
          }
        case 'emission':
          return '530px';
        default:
          if(this.podcast){
            return '520px';
          } else{
            return '530px';
          }

      }
    },

    iFrame(){
      return `<iframe src="${this.iFrameSrc}" width="${this.iFrameWidth}" height="${this.iFrameHeight}" scrolling="no" frameborder="0"></iframe>`;
    }
  },

  methods: {
  },
};
</script>
