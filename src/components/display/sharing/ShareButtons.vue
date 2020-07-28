<template>
  <div class="module-box text-center-mobile share-button-page">
    <div class="d-flex align-items-center mb-3">
      <h3 class="mb-0" v-if="!bigRound && (authenticated || participantId || organisationId || notExclusive)">{{ $t('Share') }}</h3>
      <span class="saooti-help ml-2" id="popover-share-help" :aria-label="$t('Help')" v-if="authenticated"></span>
      <b-popover target="popover-share-help" triggers="hover" placement="right" custom-class="wizard-help">
        {{$t('Share this page without edit and share blocks')}}
			</b-popover>
    </div>
    <div class="d-flex" :class="[bigRound && !audioUrl?'justify-content-center':'', verticalDisplay ? 'flex-column':'']">
      <a class="btn btn-bigRound" :title="$t('Downloading')" :href="audioUrl"  target="_blank" download  v-if="audioUrl" :aria-label="$t('Downloading')">
        <div class="saooti-download-bounty"></div>
      </a>
      <a target="_blank" :href="facebookURL" :class="[bigRound?'btn btn-bigRound':'btn btn-circle btn-facebook share-btn mb-2', verticalDisplay? '' :'mr-3']" aria-label="Facebook">
        <span class="saooti-facebook-bounty" v-if="!bigRound"></span>
        <div class="saooti-facebook-bounty" v-else></div>
      </a>
      <a target="_blank" :class="[bigRound?'btn btn-bigRound':'btn btn-circle btn-twitter share-btn mb-2', verticalDisplay? '' :'mr-3']" :href="twitterURL" aria-label="Twitter">
        <span class="saooti-twitter-bounty" v-if="!bigRound"></span>
        <div class="saooti-twitter-bounty" v-else></div>
      </a>
      <a target="_blank" :class="[bigRound?'btn btn-bigRound':'btn btn-circle btn-linkedin share-btn mb-2', verticalDisplay? '' :'mr-3']" :href="linkedinURL" aria-label="Linkedin">
        <span class="saooti-linkedin1" v-if="!bigRound"></span>
        <div class="saooti-linkedin1" v-else></div>
      </a>
      <a target="_blank" :class="[bigRound?'btn btn-bigRound':'btn btn-circle btn-rss share-btn mb-2', verticalDisplay? '' :'mr-3']" @click.prevent="openPopup()" :href="rssUrl" :title="$t('Subscribe to this emission')" aria-label="RSS" v-if="rssUrl">
        <span class="saooti-rss-bounty" v-if="!bigRound"></span>
        <div class="saooti-rss-bounty" v-else></div>
      </a>
      <a target="_blank" :class="[bigRound?'btn btn-bigRound':'btn btn-circle btn-rss share-btn mb-2', verticalDisplay? '' :'mr-3']" aria-label="copy" @click="onCopyCode">
        <span class="saooti-link" v-if="!bigRound"></span>
        <div class="saooti-link" v-else></div>
      </a>
    </div>
    <ClipboardModal
      v-if="dataRSSSave"
      :closable="true"
      @close="closeModal()"
      :link="rssUrl"
      :title="$t('RSS Link')"
    />
    <Snackbar ref="snackbar" position="bottom-left"></Snackbar>
  </div>
</template>

<style lang="scss">
.share-button-page{
  @media (max-width: 960px) {
  .flex-column{
    flex-direction: row !important;
  }
  .btn{
    margin-right: 0.5rem;
  }
  }
}
</style>

<script>
import {state} from "../../../store/paramStore.js";
import ClipboardModal from '../../misc/modal/ClipboardModal.vue'
import Snackbar from '../../misc/Snackbar.vue';
export default {
  props: [
    "podcastId",
    "emission",
    "participantId",
    "organisationId",
    'bigRound',
    'audioUrl',
    "notExclusive"
  ],

  components: {
    ClipboardModal,
    Snackbar
  },

  mounted(){
  },

  data() {
    return {
      facebookURL: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      twitterURL: `https://twitter.com/intent/tweet?text=${window.location.href}`,
      linkedinURL: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
      dataRSSSave:false
    };
  },

  computed: {
    verticalDisplay(){
      return !this.authenticated && !this.participantId && !this.organisationId && !this.notExclusive;
    },
    authenticated(){
      return state.generalParameters.authenticated;
    },
    rssUrl() {
      if (this.emission) {
        return state.generalParameters.ApiUri + "rss/emission/" + this.emission.emissionId;
      }
      if (this.organisationId) {
        return state.generalParameters.ApiUri + "rss/productor/" + this.organisationId;
      }
      if (this.participantId) {
        return state.generalParameters.ApiUri + "rss/participant/" + this.participantId;
      }
      return null;
    },
  },

  methods: {
    openPopup() {
      this.dataRSSSave = ! this.dataRSSSave;
    },
    closeModal() {
      this.dataRSSSave = false;
    },
    async onCopyCode() {
      if (typeof(navigator.clipboard)=='undefined') {
        let textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position="fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        var successful = document.execCommand('copy');
        if(successful){
          this.$refs.snackbar.open(this.$t('Link in clipboard'));
        }
        document.body.removeChild(textArea)            
      } else{
        await navigator.clipboard.writeText(window.location.href);
        this.$refs.snackbar.open(this.$t('Link in clipboard'));
      }
    },
  }
};
</script>
