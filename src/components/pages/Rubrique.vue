<template>
  <div class="page-box">
    <h1>{{ title }}</h1>
    <PodcastList :first="first" :size="size" :rubriqueId="rubriqueId" />
  </div>
</template>

<style lang="scss">
</style>

<script>
// @ is an alias to /src
import octopusApi from "@saooti/octopus-api";
import PodcastList from '../display/podcasts/PodcastList.vue';

export default {
  components: {
    PodcastList,
  },

  props: ['first', 'size', 'rubriqueId'],

  mounted() {
    this.extractTitle();
  },

  data() {
    return {
      title: '',
    };
  },

  computed: {
  },


  methods: {
    extractTitle() {
        octopusApi.fetchRubric(this.rubriqueId).then((data)=>{
            this.title = data.name;
        });
    },
  },

  watch: {
    rubriqueId(val) {
      this.extractTitle(val);
    },
  },

};
</script>
