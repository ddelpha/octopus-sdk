<template>
  <div class="page-box">
    <h1>{{ $t('All participants') }}</h1>
    <ProductorSearch 
      :organisationId='organisationId'
      :searchPattern='searchPattern'
      type='participant'
      @updateOrganisationId='updateOrganisationId'
      @updateSearchPattern='updateSearchPattern' />
    <ParticipantList
      :first="first"
      :size="size"
      :query="searchPattern"
      :organisationId="organisationId"
    />
  </div>
</template>
<style lang="scss">
</style>
<script>
// @ is an alias to /src
import ParticipantList from '../display/participant/ParticipantList.vue';
import ProductorSearch from '../display/filter/ProductorSearch.vue';
import {state} from "../../store/paramStore.js";

export default {
  components: {
    ProductorSearch,
    ParticipantList,
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
      this.$data.size = 12;
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
    };
  },

  methods:{
    updateOrganisationId(value){
      this.organisationId = value;
    },
    updateSearchPattern(value){
      this.searchPattern =value;
    }
  }

};
</script>
