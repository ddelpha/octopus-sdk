<template>
  <div class="d-flex flex-column align-items-center">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border mr-3"></div>
      <h3>{{ $t('Loading participants ...') }}</h3>
    </div>
    <ul class="participant-list" v-show="loaded">
      <ParticipantItem
        v-bind:participant="p"
        v-for="p in participants"
        v-bind:key="p.participantId"
      />
    </ul>
    <a
      class="btn btn-more"
      v-bind:href="'/main/pub/participants?first=' + dfirst + '&size=' + dsize"
      @click="displayMore"
      v-show="!allFetched && loaded"
    >
      <div class="saooti-plus"></div>
    </a>
  </div>
</template>

<style lang="scss">
.participant-list {
  align-self: stretch;
  flex-grow: 1;
  margin: 0;
  padding: 0;
  /*For ie11 */
  display: flex;
  flex-wrap: wrap;
  /* end */

  display: grid; /* 1 */
  grid-template-columns: repeat(auto-fill, 14rem); /* 2 */
  grid-gap: 2rem; /* 3 */
  justify-content: space-between; /* 4 */
}
/** PHONES*/
@media (max-width: 960px) {
  .participant-list {
    align-self: auto;
    grid-gap: 0;
  }
}
</style>

<script>
import octopusApi from "@saooti/octopus-api";
import ParticipantItem from './ParticipantItem.vue';

export default {
  name: 'ParticipantList',

  props: ['first', 'size', 'query', 'organisationId'],

  components: {
    ParticipantItem,
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
      participants: [],
    };
  },

  computed: {
    allFetched() {
      return this.dfirst >= this.totalCount;
    },
  },

  methods: {
    fetchContent(reset) {
      var self = this;
      if (reset) {
        self.$data.participants = [];
        self.$data.dfirst = 0;
        self.$data.loading = true;
        self.$data.loaded = false;
      }
      octopusApi
        .fetchParticipants({
          first: self.dfirst,
          size: self.dsize,
          query: self.query,
          organisationId: self.organisationId,
        })
        .then(function(data) {
          self.$data.loading = false;
          self.$data.loaded = true;
          self.$data.participants = self.$data.participants.concat(data.result).filter((p)=>{
            return p!== null;
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
  },
};
</script>