<template>
  <div class="page-box">
    <!-- <audio ref="audioRef" src="" id="audio-hls" width="100%" controls></audio> -->
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
/* import Hls from 'hls.js'; */

export default {
  name: 'home',

  components: {
    PodcastInlineList,
  },

  mounted(){
    /* let audio = document.getElementById('audio-hls');
    let audioSrc = 'https://hls.dev2.saooti.org/stream/test/index.m3u8';
    if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(audioSrc);
      hls.attachMedia(audio);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        audio.play();
      });
    } */
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
