<template>
  <div class="d-flex flex-column align-items-center">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border mr-3"></div>
      <h3 class="mt-2">{{ $t('Loading content ...') }}</h3>
    </div>
    <div v-if="loaded && playlists.length > 1" class="text-secondary mb-2">{{$t('Number playlists',{nb :totalCount})}}</div>
    <ul class="emission-list twoEmissions">
      <PlaylistItem
        v-bind:playlist="p"
        v-for="p in playlists"
        v-bind:key="p.playlistId"
      />
    </ul>
    <a
      class="btn"
      v-bind:href="'/main/pub/playlists?first=' + dfirst + '&size=' + dsize"
      :class="buttonPlus? 'btn-linkPlus': 'btn-more'"
      @click="displayMore"
      v-show="!allFetched && loaded"
      :aria-label="$t('See more')"
    >
      <template v-if="buttonPlus">{{$t('See more')}}</template>
      <div class="saooti-plus"></div>
    </a>
  </div>
</template>

<style lang="scss">
</style>

<script>
import octopusApi from "@saooti/octopus-api";
import PlaylistItem from './PlaylistItem.vue';
import {state} from "../../../store/paramStore.js";

export default {
  name: 'PlaylistList',

  props: ['first', 'size', 'query', 'organisationId'],

  components: {
    PlaylistItem
  },

  mounted() {
    this.fetchContent(true);
  },

  data() {
    return {
      loading: true,
      loaded: true,
      dfirst: this.$props.first,
      dsize: this.$props.size,
      totalCount: 0,
      playlists: [],
    };
  },

  computed: {
    allFetched() {
      return this.dfirst >= this.totalCount;
    },
    buttonPlus(){
      return state.generalParameters.buttonPlus;
    },
    changed(){
      return `${this.first}|${this.size}|${this.organisationId}|${this.query}`;
    },
    filterOrga(){
      return this.$store.state.filter.organisationId;
    },
    organisation(){
      if(this.organisationId){
        return this.organisationId;
      }else if(this.filterOrga){
        return this.filterOrga;
      }else {
        return undefined;
      }
    },
  },

  methods: {
    async fetchContent(reset) {
      if (reset) {
        this.dfirst = 0;
        this.loading = true;
        this.loaded = false;
      }
      let param = {
        first: this.dfirst,
        size: this.dsize,
        query: this.query,
        organisationId: this.organisation,
      }
      const data = await octopusApi.fetchPlaylists(param);
      this.afterFetching(reset, data);
    },
    
    afterFetching(reset, data){
      if (reset) {
        this.playlists = [];
        this.dfirst = 0;
      }
      this.loading = false;
      this.loaded = true;
      this.playlists = this.playlists.concat(data.result).filter((e)=>{
        return e!== null;
      });
      this.dfirst += this.dsize;
      this.totalCount = data.count;
    },

    displayMore(event) {
      event.preventDefault();
      this.fetchContent(false);
    },
  },

  watch: {
    changed:{
       handler() {
        this.fetchContent(true);
      },
    },
  },
};
</script>
