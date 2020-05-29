<template>
  <div class="page-box">
    <PodcastInlineList
      v-for="c in categories"
      :key="c.id"
      :iabId="c.id"
      :title="c.name"
      :buttonText="$t('All podcast button', { name: c.name })"
    />
  </div>
</template>
<style lang="scss">
</style>

<script>
import PodcastInlineList from '../display/podcasts/PodcastInlineList.vue';
import {state} from "../../store/paramStore.js";

export default {
  name: 'home',

  components: {
    PodcastInlineList,
  },

  computed: {
    isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },
    categories(){
      return state.generalParameters.allCategories.filter(c => {
        if(this.isPodcastmaker){
          return c.podcastOrganisationCount;
        } else{
          return c.podcastCount;
        }
      });
    },
  },
};
</script>
