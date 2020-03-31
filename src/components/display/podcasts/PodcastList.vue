<template>
  <div class="d-flex flex-column align-items-center">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border mr-3"></div>
      <h3 class="mt-2">{{ $t('Loading podcasts ...') }}</h3>
    </div>
    <div v-if="loaded && !podcasts.length">
      <p>{{ $t('No podcast match your query') }}</p>
    </div>
    <ul class="podcast-list" v-show="loaded">
      <PodcastItem
        v-bind:podcast="p"
        v-for="p in podcasts"
        v-bind:key="p.podcastId"
      />
    </ul>
    <a
      class="btn"
      v-bind:href="'/main/pub/podcasts?first=' + dfirst + '&size=' + dsize"
      :class="buttonPlus? 'btn-linkPlus mt-3': 'btn-more'"
      @click="displayMore"
      v-show="!allFetched && loaded"
    >
      <template v-if="buttonPlus">{{$t('See more')}}</template>
      <div class="saooti-plus"></div>
    </a>
  </div>
</template>

<style lang="scss">
.podcast-list {
  align-self: stretch;
  flex-grow: 1;
  margin: 0;
  padding: 0;
  /*For ie11 */
  display: flex;
  flex-wrap: wrap;
  /* end */
  display: grid; /* 1 */
  grid-template-columns: repeat(auto-fill, 13rem); /* 2 */
  grid-gap: 1rem; /* 3 */
  justify-content: space-between; /* 4 */
}
/** PHONES*/
@media (max-width: 960px) {
  .podcast-list {
    align-self: auto;
    justify-items: center;
    display: flex;
    justify-content: space-around;
  }
}
</style>

<script>
import octopusApi from "@saooti/octopus-api";
import PodcastItem from './PodcastItem.vue';
import {state} from "../../../store/paramStore.js";

export default {
  name: 'PodcastList',

  props:  {
    first: { default: 0 },
    size: { default: 5 },
    organisationId: { default: undefined },
    emissionId: { default: undefined },
    iabId: { default: undefined },
    participantId: { default: undefined },
    query: { default: undefined },
    monetization: { default: undefined },
    popularSort: { default: false },
    reload : {default: false}
  },

  components: {
    PodcastItem,
  },

  created() {
    this.fetchContent(true);
  },

  data() {
    return {
      loading: true,
      loaded: true,
      dfirst: this.$props.first,
      dsize: this.$props.size,
      totalCount: 0,
      podcasts: [],
    };
  },

  computed: {
    allFetched() {
      return this.dfirst >= this.totalCount;
    },
    buttonPlus(){
      return state.generalParameters.buttonPlus;
    }
  },

  methods: {
    fetchContent(reset) {
      if (reset) {
        this.podcasts = [];
        this.dfirst = 0;
        this.loading = true;
        this.loaded = false;
      }
      octopusApi
        .fetchPodcasts({
          first: this.dfirst,
          size: this.dsize,
          organisationId: this.organisationId,
          emissionId: this.emissionId,
          iabId: this.iabId,
          participantId: this.participantId,
          query: this.query,
          monetisable: this.monetization,
          sort: this.popularSort ? "POPULARITY" : "DATE"
        })
        .then((data)=> {
          if (reset) {
            this.podcasts = [];
            this.dfirst = 0;
            this.loading = true;
            this.loaded = false;
          }
          this.loading = false;
          this.loaded = true;
          this.podcasts = this.podcasts.concat(data.result).filter((p)=>{
            return p!== null;
          });
          this.dfirst += this.dsize;
          this.totalCount = data.count;
          if(this.podcasts.length === 0){
            this.$emit('emptyList');
          }
        });
    },

    displayMore(event) {
      event.preventDefault();
      this.fetchContent(false);
    },
  },

  watch: {
    emissionId: {
      handler() {
        this.fetchContent(true);
      },
    },
    organisationId: {
      handler() {
        this.fetchContent(true);
      },
    },
    iabId: {
      handler() {
        this.fetchContent(true);
      },
    },
    participantId: {
      handler() {
        this.fetchContent(true);
      },
    },
    query: {
      handler() {
        this.fetchContent(true);
      },
    },
    monetization: {
      handler() {
        this.fetchContent(true);
      },
    },
    reload: {
      handler() {
        this.fetchContent(true);
      },
    }
  },
};
</script>
