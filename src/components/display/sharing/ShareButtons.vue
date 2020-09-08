<template>
  <div class="module-box text-center-mobile share-button-page">
    <div class="d-flex align-items-center mb-3">
      <h3 class="mb-0" v-if="!bigRound && (authenticated || participantId || organisationId)">{{ $t('Share') }}</h3>
      <span class="saooti-help ml-2" id="popover-share-help" :aria-label="$t('Help')" v-if="authenticated"></span>
      <b-popover target="popover-share-help" triggers="hover" placement="right" custom-class="wizard-help">
        {{$t('Share this page without edit and share blocks')}}
			</b-popover>
    </div>
    <div class="d-flex" :class="[bigRound && !audioUrl?'justify-content-center':'', countLink >1? 'flex-wrap':'', !authenticated && !participantId && !organisationId ? 'flex-column':'']">
      <a class="btn btn-bigRound" :title="$t('Downloading')" :href="audioUrl"  target="_blank" download  v-if="audioUrl" :aria-label="$t('Downloading')">
        <div class="saooti-download-bounty"></div>
      </a>
      <a target="_blank" :href="facebookURL" :class="[bigRound?'btn btn-bigRound':'btn btn-circle btn-facebook share-btn mb-2', verticalDisplay? '' :'mr-2 ml-2']" aria-label="Facebook">
        <span class="saooti-facebook-bounty" v-if="!bigRound"></span>
        <div class="saooti-facebook-bounty" v-else></div>
      </a>
      <a target="_blank" :class="[bigRound?'btn btn-bigRound':'btn btn-circle btn-twitter share-btn mb-2', verticalDisplay? '' :'mr-2 ml-2']" :href="twitterURL" aria-label="Twitter">
        <span class="saooti-twitter-bounty" v-if="!bigRound"></span>
        <div class="saooti-twitter-bounty" v-else></div>
      </a>
      <a target="_blank" :class="[bigRound?'btn btn-bigRound':'btn btn-circle btn-linkedin share-btn mb-2', verticalDisplay? '' :'mr-2 ml-2']" :href="linkedinURL" aria-label="Linkedin">
        <span class="saooti-linkedin1" v-if="!bigRound"></span>
        <div class="saooti-linkedin1" v-else></div>
      </a>
      <a target="_blank" :class="[bigRound?'btn btn-bigRound':'btn btn-circle btn-rss share-btn mb-2', verticalDisplay? '' :'mr-2 ml-2']" @click.prevent="openPopup()" :href="rssUrl" :title="$t('Subscribe to this emission')" aria-label="RSS" v-if="rssUrl">
        <span class="saooti-rss-bounty" v-if="!bigRound"></span>
        <div class="saooti-rss-bounty" v-else></div>
      </a>
      <a target="_blank" :class="[bigRound?'btn btn-bigRound':'btn btn-circle btn-rss share-btn mb-2', verticalDisplay? '' :'mr-2 ml-2']" aria-label="copy" @click="onCopyCode">
        <span class="saooti-link" v-if="!bigRound"></span>
        <div class="saooti-link" v-else></div>
      </a>
      <a target="_blank" v-if="podcast" :class="[bigRound?'btn btn-bigRound':'btn btn-circle btn-rss share-btn mb-2', verticalDisplay? '' :'mr-2 ml-2']" :aria-label="$t('Share newsletter')" @click="newsletter=true;">
        <span class="saooti-mail-bounty" v-if="!bigRound"></span>
        <div class="saooti-mail-bounty" v-else></div>
      </a>
    </div>
    <ClipboardModal
      v-if="dataRSSSave"
      :closable="true"
      @close="closeModal()"
      :link="rssUrl"
      :title="$t('RSS Link')"
    />
    <NewsletterModal
      v-if="newsletter"
      :closable="true"
      :podcast="podcast"
      @close="newsletter=false"
    />
    <Snackbar ref="snackbar" position="bottom-left"></Snackbar>
  </div>
</template>

<style lang="scss">
.saooti-tunin{
  color: #36b4a7;
}
.saooti-radioline{
  color: #2273b9;
}
.saooti-tootak{
  color: #ff4d53;
}
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
import ClipboardModal from '../../misc/modal/ClipboardModal.vue';
import NewsletterModal from '../../misc/modal/NewsletterModal.vue';
import Snackbar from '../../misc/Snackbar.vue';
export default {
  props: [
    "podcast",
    "emission",
    "participantId",
    "organisationId",
    'bigRound',
    'audioUrl'
  ],

  components: {
    ClipboardModal,
    NewsletterModal,
    Snackbar
  },

  mounted(){
    this.applePodcast = this.externaliseLinks(this.applePodcast);
    this.deezer = this.externaliseLinks(this.deezer);
    this.spotify = this.externaliseLinks(this.spotify);
    this.tunein = this.externaliseLinks(this.tunein);
    this.tootak = this.externaliseLinks(this.tootak);
    this.radioline = this.externaliseLinks(this.radioline);
  },

  data() {
    return {
      facebookURL: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      twitterURL: `https://twitter.com/intent/tweet?text=${window.location.href}`,
      linkedinURL: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
      dataRSSSave:false,
      newsletter: false,
    };
  },

  computed: {
    authenticated(){
      return state.generalParameters.authenticated;
    },
    countLink(){
      let count = 0;
      if (this.applePodcast !== undefined) count++;
      if (this.deezer !== undefined) count++;
      if (this.spotify !== undefined) count++;
      if (this.tunein !== undefined) count++;
      if (this.tootak !== undefined) count++;
      if (this.radioline !== undefined) count++;
      return count;
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

    iFrameNumber: {
      get() {
        return this.iFrameNumberPriv;
      },
      set(value) {
        let val = parseInt(value, 10);
        if (!isNaN(val) && val >= 1 && val <= 10) {
          this.iFrameNumberPriv = value;
        }
      }
    },

    iFrameWidth() {
      switch (this.iFrameModel) {
        case "large":
          return "730px";
        default:
          return "355px";
      }
    },

    iFrameHeight() {
      switch (this.iFrameModel) {
        case "large":
          return "165px";
        case "emission":
          return "530px";
        default:
          return "494px";
      }
    }
  },

  methods: {
    externaliseLinks(link){
      if(link && !link.startsWith('http') && !link.startsWith('//')){
        return '//' + link;
      }
      return link;
    },
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
