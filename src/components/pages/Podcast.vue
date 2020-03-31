<template>
  <div>
    <div class="page-box" v-if="loaded && !error">
      <h1 v-if="!isOuestFrance">{{ $t('Episode') }}</h1>
      <div class="d-flex">
        <div class="d-flex flex-column flex-super-grow">
          <EditBox :podcast="podcast" v-if="editRight && isEditBox"></EditBox>
          <div class="module-box">
            <h2 class="text-uppercase font-weight-bold title-page-podcast" v-if="!isOuestFrance">{{ this.podcast.title }}</h2>
            <router-link v-bind:to="'/main/pub/emission/' + this.podcast.emission.emissionId" v-else>
              <h1>{{ this.podcast.emission.name }}</h1>
            </router-link>
            <div class="mb-5 d-flex">
              <div>
              <PodcastImage
                :class="isOuestFrance? '':'shadow-element'"
                class="mr-3" 
                v-bind:podcast="podcast" 
                hidePlay='false'
                :playingPodcast='playingPodcast' 
                @playPodcast='playPodcast' />
                <h3 v-if="isOuestFrance">{{ this.podcast.title }}</h3>
                <div class="date-text-zone">
                  <div class="mr-5" v-if="!isOuestFrance">{{ date }}</div>
                  <div><span class="saooti-clock3" v-if="isOuestFrance"></span>{{ $t('Duration', { duration: duration }) }}</div>
                </div>
                <div class="descriptionText" v-html="this.podcast.description">{{ this.podcast.description }}</div>
                <div class="mt-3 mb-3">
                  <div class="comma">{{ $t('Animated by : ') }}
                    <router-link
                      class="link-info"
                      v-bind:to="
                        '/main/pub/participant/' + animator.participantId
                      "
                      v-for="animator in podcast.animators"
                      v-bind:key="animator.participantId"
                    >{{ getName(animator) }}</router-link>
                  </div>
                  <div v-if="!isOuestFrance">{{ $t('Emission') + ' : ' }}
                    <router-link
                      class="link-info"
                      v-bind:to="
                        '/main/pub/emission/' + this.podcast.emission.emissionId
                      "
                    >{{ this.podcast.emission.name }}</router-link>
                  </div>
                  <div v-if="!isPodcastmaker">{{ $t('Producted by : ') }}
                    <router-link
                      class="link-info"
                      v-bind:to="'/main/pub/productor/' + podcast.organisation.id"
                    >{{ this.podcast.organisation.name }}</router-link>
                  </div>
                  <div class="comma" v-if="podcast.guests">{{ $t('Guests') + ' : ' }}
                    <router-link
                      class="link-info"
                      v-bind:to="'/main/pub/participant/' + guest.participantId"
                      v-for="guest in podcast.guests"
                      v-bind:key="guest.participantId"
                    >{{ getName(guest) }}</router-link>
                  </div>
                  <div v-if="editRight && !isPodcastmaker">
                    <div
                      class="mr-5"
                      v-if="podcast.annotations && podcast.annotations.RSS"
                    >{{ $t('From RSS') }}</div>
                      <div class="alert-text" v-if="!podcast.availability.visibility">
                        <img src="/img/caution.png" class="icon-caution"/>
                        {{ $t('Podcast is not visible for listeners') }}
                      </div>
                  </div>
                  <ShareButtons :podcastId="podcastId" :bigRound='true' :audioUrl="podcast.audioUrl" v-if="isDownloadButton"></ShareButtons>
                </div>
              </div>
            </div>
            <TagList v-if="isTagList" :tagList='podcast.tags'/>
          </div>
        </div>
        <div class="d-flex flex-column flex-grow">
          <SharePlayer
            :podcast="podcast"
            :emissionId="podcast.emission.emissionId"
            :exclusive="exclusive"
            :organisationId='organisationId'
            v-if="isSharePlayer"
          ></SharePlayer>
          <ShareButtons :podcastId="podcastId" v-if="isShareButtons"></ShareButtons>
        </div>
      </div>
      <template v-if="!isOuestFrance">
        <PodcastInlineList
          :emissionId="this.podcast.emission.emissionId"
          :href="'/main/pub/emission/' + this.podcast.emission.emissionId"
          :title="$t('More episodes of this emission')"
          :buttonText="$t('All podcast emission button')"
        />
        <PodcastInlineList
          v-for="c in categories"
          :key="c.id"
          :iabId="c.id"
          :href="'/main/pub/category/' + c.id"
          :title="$t('More episodes of this category : ', { name: c.name })"
          :buttonText="$t('All podcast button', { name: c.name })"
        />
      </template>
    </div>
    <div class="d-flex justify-content-center" v-if="!loaded">
      <div class="spinner-border mr-3"></div>
      <h3 class="mt-2">{{ $t('Loading content ...') }}</h3>
    </div>
    <div class="text-center" v-if="error">
      <h3>{{ $t("Podcast doesn't exist") }}</h3>
    </div>
  </div>
</template>
<style lang="scss">
.title-page-podcast {
  font-size: 0.9rem;
}

.date-text-zone{
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-bottom:1rem;
  @media (max-width: 600px) {
    display: initial;
  }
}
</style>
<script>
// @ is an alias to /src
import EditBox from "@/components/display/edit/EditBox.vue";
import SharePlayer from "../display/sharing/SharePlayer.vue";
import ShareButtons from "../display/sharing/ShareButtons.vue";
import PodcastInlineList from "../display/podcasts/PodcastInlineList.vue";
import PodcastImage from "../display/podcasts/PodcastImage.vue";
import TagList from "../display/podcasts/TagList.vue";
import octopusApi from "@saooti/octopus-api";
import {state} from "../../store/paramStore.js";
const moment = require("moment");
const humanizeDuration = require("humanize-duration");

export default {
  components: {
    PodcastInlineList,
    PodcastImage,
    ShareButtons,
    SharePlayer,
    EditBox,
    TagList
  },

  mounted() {
    this.getPodcastDetails(this.podcastId);
  },

  props: ["podcastId", "playingPodcast"],

  data() {
    return {
      loaded: false,
      podcast: undefined,
      error: false,
      exclusive: false
    };
  },

  computed: {
    isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },
    isEditBox(){
      return state.podcastPage.EditBox;
    },
    isShareButtons(){
      return state.podcastPage.ShareButtons;
    },
    isSharePlayer(){
      return state.podcastPage.SharePlayer;
    },
    allCategories(){
      return state.generalParameters.allCategories;
    },
    organisationId(){
      return state.generalParameters.organisationId;
    },
    authenticated(){
      return state.generalParameters.authenticated;
    },
    isOuestFrance(){
      return state.podcastPage.ouestFranceStyle;
    },
    isTagList(){
      return state.podcastPage.tagList;
    },
    isDownloadButton(){
      return state.podcastPage.downloadButton;
    },
    emissionMainCategory() {
      if (
        this.podcast.emission.annotations &&
        this.podcast.emission.annotations.mainIabId
      ) {
        return parseInt(this.podcast.emission.annotations.mainIabId, 10);
      } else if (
        this.podcast.emission.iabIds &&
        this.podcast.emission.iabIds.length
      ) {
        return this.podcast.emission.iabIds[0];
      } else {
        return 0;
      }
    },

    categories() {
      if (typeof this.podcast !== "undefined") {
        return this.allCategories
          .filter(item => {
            return this.podcast.emission.iabIds.indexOf(item.id) !== -1;
          })
          .sort((a, b) => {
            if (a.id === this.emissionMainCategory) return -1;
            if (b.id === this.emissionMainCategory) return 1;
            return 0;
          });
      } else {
        return "";
      }
    },

    date() {
      return moment(this.podcast.pubDate).format("D MMMM YYYY [à] HH[h]mm");
    },

    duration() {
      return humanizeDuration(this.podcast.duration, {
        language: "fr",
        largest: 1,
        round: true
      });
    },

    editRight() {
      if (this.authenticated) {
        if (this.organisationId === this.podcast.organisation.id) {
          return true;
        }
        if (state.generalParameters.isAdmin) {
          return true;
        }
      }
      return false;
    }
  },

  watch: {
    podcastId(val) {
      this.loaded = false;
      this.error = false;
      this.getPodcastDetails(val);
    }
  },

  methods: {
    getPodcastDetails(podcastId) {
      octopusApi
        .fetchPodcast(podcastId)
        .then(data => {
          this.podcast = data;
          this.$emit('podcastTitle', this.podcast.title);
          if (
            this.podcast.emission.annotations &&
            this.podcast.emission.annotations.exclusive
          ) {
            this.exclusive =
              this.podcast.emission.annotations.exclusive == "true"
                ? true
                : false;
            this.exclusive =
              this.exclusive &&
              this.organisationId !== this.podcast.organisation.id;
          }
          if(!this.podcast.availability.visibility && !this.editRight){
            this.error= true;
          }
          this.loaded = true;
        })
        .catch(() => {
          this.error = true;
          this.loaded = true;
        });
    },
    getName(person) {
      const first = person.firstName || "";
      const last = person.lastName || "";
      return (first + " " + last).trim();
    },
    playPodcast(podcast){
      this.$emit('playPodcast', podcast);
    },
  }
};
</script>
