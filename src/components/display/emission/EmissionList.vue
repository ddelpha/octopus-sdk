<template>
  <div class="d-flex flex-column align-items-center">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border mr-3"></div>
      <h3 class="mt-2">{{ $t('Loading emissions ...') }}</h3>
    </div>
    <ul class="emission-list" :class="smallItems? 'threeEmissions': 'twoEmissions'" v-show="loaded" v-if="!itemPlayer">
      <EmissionItem
        v-bind:emission="e"
        v-for="e in emissions"
        v-bind:key="e.emissionId"
      />
    </ul>
    <ul class="d-flex flex-wrap justify-content-around" v-show="loaded" v-else>
      <EmissionPlayerItem
        v-bind:emission="e"
        v-for="e in emissions"
        v-bind:key="e.emissionId"
        class="m-3 flex-shrink"
      />
    </ul>
    <a
      class="btn"
      v-bind:href="'/main/pub/emissions?first=' + dfirst + '&size=' + dsize"
      :class="buttonPlus? 'btn-linkPlus': 'btn-more'"
      @click="displayMore"
      v-show="!allFetched && loaded"
    >
      <template v-if="buttonPlus">{{$t('See more')}}</template>
      <div class="saooti-plus"></div>
    </a>
  </div>
</template>

<style lang="scss">
.loading-title {
  margin: 0.4rem 0 0;
}
.emission-list {
  align-self: stretch;
  flex-grow: 1;
  margin: 0;
  padding: 0;
  /*For ie11 */
  display: flex;
  flex-wrap: wrap;
  /* end */

  display: grid; /* 1 */
  grid-gap: 1rem; /* 3 */
  justify-content: space-between; /* 4 */
}
.twoEmissions{
  grid-template-columns: repeat(auto-fill, 49%); /* 2 */
}

.threeEmissions{
  grid-template-columns: repeat(auto-fill, 32%); /* 2 */
}

/** PHONES*/
@media (max-width: 1200px) {
  .emission-list {
    grid-template-columns: auto;
  }
}
</style>

<script>
import octopusApi from "@saooti/octopus-api";
import EmissionItem from './EmissionItem.vue';
import EmissionPlayerItem from './EmissionPlayerItem.vue';
import {state} from "../../../store/paramStore.js";

export default {
  name: 'EmissionList',

  props: ['first', 'size', 'query', 'organisationId', 'monetization'],

  components: {
    EmissionItem,
    EmissionPlayerItem
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
      emissions: [],
    };
  },

  computed: {
    allFetched() {
      return this.dfirst >= this.totalCount;
    },
    buttonPlus(){
      return state.generalParameters.buttonPlus;
    },
    smallItems(){
      return state.emissionsPage.smallItems;
    },
    itemPlayer(){
      return state.emissionsPage.itemPlayer;
    }
  },

  methods: {
    fetchContent(reset) {
      var self = this;
      if (reset) {
        self.$data.emissions = [];
        self.$data.dfirst = 0;
        self.$data.loading = true;
        self.$data.loaded = false;
      }
      octopusApi
        .fetchEmissions( {
          first: self.dfirst,
          size: self.dsize,
          query: self.query,
          organisationId: self.organisationId,
          monetisable: self.monetization,
        })
        .then(function(data) {
          self.$data.loading = false;
          self.$data.loaded = true;
          self.$data.emissions = self.$data.emissions.concat(data.result).filter((e)=>{
            return e!== null;
          });
          self.$data.dfirst += self.$data.dsize;
          self.$data.totalCount = data.count;
        });
    },

    displayMore(event) {
      event.preventDefault();
      this.fetchContent(false);
    },
  },

  watch: {
    query: {
      handler() {
        this.fetchContent(true);
      },
    },
    organisationId: {
      handler() {
        this.fetchContent(true);
      },
    },
    monetization: {
      handler() {
        this.fetchContent(true);
      },
    },
  },
};
</script>
