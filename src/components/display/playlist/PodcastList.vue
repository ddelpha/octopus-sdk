<template>
  <div class="d-flex flex-column align-items-center">
    <h2 class="mt-3 align-self-baseline" v-if="notEmptyPlaylist">{{$t('Podcasts in the playlist')}}</h2>
    <h2 class="mt-3 align-self-baseline" v-else>{{$t('No podcasts in the playlist')}}</h2>
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border mr-3"></div>
      <h3 class="mt-2">{{ $t('Loading podcasts ...') }}</h3>
    </div>
    <div v-if="loaded && !podcasts.length && notEmptyPlaylist">
      <p>{{ $t('No podcast match your query')}}</p>
    </div>
    <div v-if="loaded && podcasts.length > 1" class="text-secondary mb-2">{{$t('Number podcasts',{nb :podcasts.length})}}</div>
    <div class="d-flex position-relative width-600 align-self-baseline" v-if="notEmptyPlaylist">
        <label for="search" class="d-inline" :aria-label="$t('Search')"></label>
        <input :placeholder="$t('Search')" v-model="searchPattern" class="filter-search-input input-no-outline flex-grow" id="search"/>
        <div class="saooti-search-bounty filter-list-search-icon search-icon-container"></div>
      </div>
    <ul class="podcast-list" v-show="loaded">
      <PodcastItem
        :podcast="p"
        v-for="p in podcastsDisplay"
        :key="p.podcastId"
      />
    </ul>
    <a
      class="btn"
      :class="buttonPlus? 'btn-linkPlus mt-3': 'btn-more'"
      @click="displayMore"
      v-show="size < podcasts.length && loaded"
      :aria-label="$t('See more')"
    >
      <template v-if="buttonPlus">{{$t('See more')}}</template>
      <div class="saooti-plus"></div>
    </a>
  </div>
</template>

<style lang="scss">
.width-600{
  width: 600px;
}
</style>

<script>
import octopusApi from "@saooti/octopus-api";
import PodcastItem from '../podcasts/PodcastItem.vue';
import {state} from "../../../store/paramStore.js";

export default {
  name: 'PodcastList',

  props: ["playlist"],

  components: {
    PodcastItem,
  },

  created() {
    if(this.notEmptyPlaylist){
      this.fetchContent();
    }else{
      this.loading = false;
      this.loaded = true;
    }
  },

  data() {
    return {
      loading: true,
      loaded: true,
      podcasts: [],
      podcastsQuery: [],
      size: 12,
      searchPattern: "",
    };
  },

  computed: {
    notEmptyPlaylist(){
      return Object.keys(this.playlist.podcasts).length !== 0;
    },
    podcastsDisplay(){
      if(this.size < this.podcastsQuery.length){
        return this.podcastsQuery.slice(0, this.size);
      }else{
        return this.podcastsQuery.slice(0, this.podcasts.length);
      }
    },
    buttonPlus(){
      return state.generalParameters.buttonPlus;
    },
  },

  methods: {
    async fetchContent() {
      this.podcasts = [];
      this.loading = true;
      this.loaded = false;
      let content = await octopusApi.fetchPlaylistContent(this.playlist.playlistId);
      for (let index = 0; index < content.length; index++) {
        content[index].order = this.playlist.podcasts[content[index].podcastId];
      }
      this.podcasts = content;
		/* 	for (const property in this.playlist.podcasts) {
				const index = content.findIndex(element => element.podcastId === parseInt(property,10));
				if(index !== -1){
					this.podcasts.push({...content[index], ...{order: this.playlist.podcasts[property]}});
				}
			}
      this.podcasts.sort((a, b) => parseFloat(b.order) - parseFloat(a.order)); */
      this.podcastsQuery = this.podcasts;
      this.loading = false;
      this.loaded = true;
    },

    displayMore(event) {
      event.preventDefault();
      this.size += 12;
    },
  },
  watch:{
    searchPattern(){
      if(this.searchPattern !== ""){
        this.podcastsQuery = this.podcasts.filter((el)=>{
          return el.title.toLowerCase().includes(this.searchPattern.toLowerCase());
        });
      }else{
        this.podcastsQuery = this.podcasts;
      }
    }
  }
};
</script>