<template>
  <div>
    <div class="module-box text-center-mobile">
      <h3>{{ $t('Embed') }}</h3>
      <div class="d-flex flex-column align-items-center" v-if="!exclusive && (authenticated || notExclusive)">
        <div
          v-if="noAd"
          class="sticker"
          :title="$t('You cannot insert advertising')"
        >{{ $t('No advertising') }}</div>
        <iframe
          title="miniplayer"
          :src="iFrameSrc"
          scrolling="no"
          frameborder="0"
          :width="iFrameWidth"
          :height="iFrameHeight"
          class="maxIframe"
        ></iframe>
        <div class="d-flex flex-column">
          <button class="btn mb-3" @click="isShareModal = true;">{{ $t('Share the player') }}</button>
          <label for="iframe-select" class="d-inline" aria-label="select miniplayer"></label>
          <select v-model="iFrameModel" id="iframe-select" class="frame-select input-no-outline">
            <option value="default">{{$t('Default version')}}</option>
            <option value="large">{{$t('Large version')}}</option>
            <option value="emission" v-if="podcast && podcast.podcastId">{{$t('Emission version')}}</option>
            <option value="largeEmission" v-if="podcast && podcast.podcastId">{{$t('Large emission version')}}</option>
            <option value="largeSuggestion" v-if="podcast && podcast.podcastId">{{$t('Large suggestion version')}}</option>
          </select>
        </div>
        <div class="d-flex justify-content-around mt-3 flex-grow w-100" >
          <div class="d-flex flex-column align-items-center flex-shrink mr-3">
            <div class="font-weight-600">{{$t('Choose color')}}</div>
            <swatches v-model="color" class="c-hand input-no-outline" show-fallback colors="text-advanced" popover-to="right" :data-color="color"></swatches>
          </div>  
          <div class="d-flex flex-column align-items-center">
            <div class="font-weight-600">{{$t('Choose theme')}}</div>
            <div class="d-flex">
              <swatches v-model="theme" :data-theme="theme" class="c-hand input-no-outline mr-1" :swatch-style="{padding: '0px 0px', marginRight: '0px', marginBottom: '0px', border:'1px gray solid'}" :wrapper-style="{paddingTop: '0px', paddingLeft: '0px', paddingRight: '0px', paddingBottom: '0px'}" :colors="['#000000']" inline ></swatches>
              <swatches v-model="theme" :data-theme="theme" class="c-hand input-no-outline" :swatch-style="{padding: '0px 0px', marginRight: '0px', marginBottom: '0px', border:'1px gray solid'}" :wrapper-style="{paddingTop: '0px', paddingLeft: '0px', paddingRight: '0px', paddingBottom: '0px'}" :colors="['#ffffff']" inline ></swatches>
            </div>
          </div> 
        </div>
        <div class="d-flex flex-column align-items-center flex-grow" v-if="!podcast || iFrameModel === 'emission' || iFrameModel === 'largeEmission' || iFrameModel === 'largeSuggestion'">
        <div class="d-flex align-items-center w-100 flex-wrap mt-3" v-if="!podcast || iFrameModel === 'emission' || iFrameModel === 'largeEmission'">
          <b-form-radio v-model="episodeNumbers" name="episodeNumbers" value="all" ></b-form-radio>
          <span class="flex-shrink">{{ $t('Show every episode') }}</span>
        </div>
        <div class="d-flex align-items-center flex-wrap" :class="!podcast || iFrameModel === 'emission' || iFrameModel === 'largeEmission'? '':'mt-3'">
          <b-form-radio v-model="episodeNumbers" name="episodeNumbers" value="number" v-if="!podcast || iFrameModel === 'emission' || iFrameModel === 'largeEmission'"></b-form-radio>
          <span class="flex-shrink">{{ $t('Show') }}</span>
          <input
            id="number-input"
            type="number"
            v-model="iFrameNumber"
            min="1"
            max="50"
            class="input-share-player input-no-outline text-center m-2"
          />
          <label for="number-input" class="d-inline" :aria-label="$t('Number of player podcasts')"></label>
          <span class="flex-shrink">{{ $t('Last podcasts') }}</span>
        </div>
        <div class="checkbox-saooti">  
          <input type="checkbox" class="custom-control-input" id="proceedCheck" v-model="proceedReading">  
          <label class="custom-control-label" for="proceedCheck">{{$t('Proceed reading')}}</label>  
        </div>
        </div>
      </div>
      <div v-else-if="exclusive && authenticated">{{ $t('Only organisation members can share the content') }}</div>
      <div v-else-if="!authenticated">{{ $t('Only authenticated members can share the content') }}</div>
    </div>
    <ShareModal
      v-if="isShareModal"
      @close="isShareModal=false;"
      :embedLink="iFrame"
      :embedlyLink="iFrameSrc"
      :directLink="podcast"
    ></ShareModal>
  </div>
</template>

<style lang="scss">
@import "../../../sass/_variables.scss";
.custom-radio .custom-control-label{
  cursor: pointer;
}
.input-share-player{
  border: 1px solid #ddd;
  border-radius: 50px;
  &#number-input{
    margin: 0 1rem;
    width: 60px;
  }
}
.sticker {
  align-self: center;
  background: rgba($octopus-primary-color, 0.3);
  padding: 0.5rem;
  transition: all 0.5s ease;
  color: #41403e;
  letter-spacing: 1px;
  outline: none;
  box-shadow: 10px 10px 34px -15px hsla(0, 0%, 0%, 0.4);
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  border: solid 2px #41403e;
  &:hover {
    box-shadow: 2px 8px 4px -6px hsla(0, 0%, 0%, 0.3);
  }
}
.maxIframe{
  max-width: 300px;
}
.vue-swatches__container{
  padding : 0 !important;
  background-color: transparent !important;
}
.vue-swatches__swatch--selected{
  border: 2px #40a372 solid !important;
  box-shadow: unset !important;
  -webkit-box-shadow: unset !important;
}

</style>

<script>
import ShareModal from "../../misc/modal/ShareModal.vue";
import { state } from "../../../store/paramStore.js";
import Swatches from "vue-swatches";
import "vue-swatches/dist/vue-swatches.min.css";
import profileApi from '@/api/profile';

export default {
  props: ["podcast", "emission", "organisationId", "exclusive", "notExclusive"],

  components: {
    ShareModal,
    Swatches
  },

  created() {
    let orgaId = undefined;
    if(this.authenticated){
      if(this.podcast){
        orgaId= this.podcast.organisation.id;
      }else{
        orgaId= this.emission.orga.id;
      }
      profileApi.fetchOrganisationAttibutes(this.$store, orgaId)
      .then(data => {
        if(data.hasOwnProperty('COLOR')) {
          this.color = data.COLOR;
        } else {
          this.color = "#40a372";
        }
        if(data.hasOwnProperty('THEME')) {
          this.theme = data.THEME;
        } else {
          this.theme = "#ffffff";
        }
      });
    }
  },

  data() {
    return {
      iFrameModel: "default",
      iFrameNumberPriv: "3",
      isShareModal: false,
      color: "#40a372",
      theme: "#ffffff",
      proceedReading: true,
      episodeNumbers: 'number'
    };
  },
  computed: {
    noAd() {
      if (
        (this.podcast &&
          this.podcast.organisation.id !== this.organisationId &&
          this.podcast.monetisable === "NO") ||
        (this.podcast &&
          this.podcast.monetisable === "UNDEFINED" &&
          this.podcast.emission.monetisable === "NO")
      ) {
        return true;
      } else {
        return false;
      }
    },
    authenticated() {
      return state.generalParameters.authenticated;
    },
    iFrameSrc() {
      let url = "";
      let iFrameNumber = "/"+this.iFrameNumberPriv;
      if((!this.podcast || this.iFrameModel === "emission" || this.iFrameModel === "largeEmission") && this.episodeNumbers === "all"){
        iFrameNumber = "/0";
      }
      if (!this.podcast) {
        if (this.iFrameModel === "default") {
          url = `${state.podcastPage.MiniplayerUri}miniplayer/emission/${this.emission.emissionId}${iFrameNumber}`;
        } else {
          url = `${state.podcastPage.MiniplayerUri}miniplayer/emissionLarge/${this.emission.emissionId}${iFrameNumber}`;
        }
      } else {
        if (
          this.iFrameModel === "emission" ||
          this.iFrameModel === "largeEmission"
        ) {
          url = `${state.podcastPage.MiniplayerUri}miniplayer/${this.iFrameModel}/${this.emission.emissionId}${iFrameNumber}/${this.podcast.podcastId}`;
        } else if (this.iFrameModel === "largeSuggestion") {
          url = `${state.podcastPage.MiniplayerUri}miniplayer/${this.iFrameModel}/${this.podcast.podcastId}${iFrameNumber}`;
        } else {
          url = `${state.podcastPage.MiniplayerUri}miniplayer/${this.iFrameModel}/${this.podcast.podcastId}`;
        }
      }
      url += "?distributorId=" + this.organisationId;
      url += "&color=" + this.color.substring(1) + "&theme=" +this.theme.substring(1);
      
      if(!this.proceedReading){
        url += "&proceed=false";
      }
      return url;
    },

    iFrameNumber: {
      get() {
        return this.iFrameNumberPriv;
      },
      set(value) {
        let val = parseInt(value, 10);
        if (!isNaN(val) && val >= 1 && val <= 50) {
          this.iFrameNumberPriv = value;
        }
      }
    },

    iFrameWidth() {
      return "100%";
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
        case "emission":
          return "530px";
        default:
          if (this.podcast) {
            return "520px";
          } else {
            return "530px";
          }
      }
    },

    iFrame() {
      return `<iframe src="${this.iFrameSrc}" width="${this.iFrameWidth}" height="${this.iFrameHeight}" scrolling="no" frameborder="0"></iframe>`;
    }
  },

  methods: {},
};
</script>