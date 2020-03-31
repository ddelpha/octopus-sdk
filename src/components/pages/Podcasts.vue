<template>
  <div class="page-box">
    <div class="d-flex" :class="isEmissionChooser?'justify-content-between':'justify-content-center'">
      <h1 v-if="titlePage === undefined" class="flex-shrink">{{ $t('All podcasts') }}</h1>
      <h1 v-else class="flex-shrink">{{ titlePage }}</h1>
      <EmissionChooser @selected='emissionSelected' v-if="isEmissionChooser" :defaultanswer="$t('No emission filter')" width='auto' class="ml-3"/>
    </div>
    <ProductorSearch 
      :organisationId='organisationId' 
      :searchPattern='searchPattern'
      @updateOrganisationId='updateOrganisationId'
      @updateSearchPattern='updateSearchPattern'
      v-if="isProductorSearch" />
    <MonetizableFilter @updateMonetization='updateMonetization' :isEmission='false' v-if="isMonetizableFilter"/>
    <PodcastList :first="first" :size="size" :organisationId='organisationId' :query='searchPattern' :monetization="monetization" :emissionId='emissionId'/>
  </div>
</template>
<style lang="scss">
</style>
<script>
// @ is an alias to /src
import PodcastList from '../display/podcasts/PodcastList.vue';
import {state} from "../../store/paramStore.js";
import ProductorSearch from '../display/filter/ProductorSearch.vue';
import MonetizableFilter from '../display/filter/MonetizableFilter.vue';
import EmissionChooser from '../display/emission/EmissionChooser.vue';

export default {
  components: {
    PodcastList,
    ProductorSearch,
    MonetizableFilter,
    EmissionChooser
  },

  created() {
    if (this.$route.query.first) {
      this.$data.first = this.$route.query.first;
    } else {
      this.$data.first = 0;
    }
    if (this.$route.query.size) {
      this.$data.size = this.$route.query.size;
    } else {
      this.$data.size = 49;
    }
    if (this.$route.query.productor) {
      this.$data.organisationId = this.$route.query.productor;
    } else if (state.filter.organisationId) {
      this.$data.organisationId = state.filter.organisationId;
    }
  },

  data() {
    return {
      first: undefined,
      size: undefined,
      searchPattern: '',
      organisationId: undefined,
      monetization: undefined,
      emissionId: undefined,
    };
  },

  computed:{
    isProductorSearch(){
      return state.podcastsPage.ProductorSearch;
    },
    isMonetizableFilter(){
      return state.podcastsPage.MonetizableFilter;
    },
    titlePage(){
      return state.podcastsPage.titlePage;
    },
    isEmissionChooser(){
      return state.podcastsPage.emissionChooser;
    },
  },

  methods:{
    updateOrganisationId(value){
      this.organisationId = value;
    },
    updateSearchPattern(value){
      this.searchPattern =value;
    },
    updateMonetization(value){
      this.monetization = value;
    },
    emissionSelected(emission){
      if (emission && emission.emissionId) {
        this.emissionId = emission.emissionId;
      } else {
        this.emissionId = undefined;
      }
    }
  }
};
</script>
