import Vue from 'vue';
import Vuex from 'vuex';

//Utilisation de VueX pour le store https://vuex.vuejs.org/fr/guide/
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
		player: {
      status: 'STOPPED', //STOPPED, LOADING, PLAYING, PAUSED
      podcast: undefined,
      volume: 1, //From 0 to 1
      elapsed: 0, //From 0 to 1
      total: 0,
    },
    authentication:{
      isAuthenticated : true,
    }
  },

  getters: {},
  mutations: {
		playerPlayPodcast(state, podcast) {
      if (!podcast) {
        state.player = {
          status: 'STOPPED', //STOPPED, LOADING, PLAYING, PAUSED
          podcast: undefined,
          elapsed: 0,
        };
      } else {
        if (
          state.player.podcast &&
          state.player.podcast.podcastId === podcast.podcastId
        ) {
          //Do nothing
        } else {
          state.player = {
            status: 'LOADING', //STOPPED, LOADING, PLAYING, PAUSED
            podcast: podcast,
            elapsed: 0,
          };
        }
      }
    },

    playerPause(state, pause) {
      if (pause) {
        state.player.status = 'PAUSED';
      } else {
        state.player.status = 'PLAYING';
      }
    },

    playerElapsed(state, elapsed) {
      state.player.elapsed = elapsed;
    },

    playerTotalTime(state, total) {
      state.player.total = total;
    },

    playerVolume(state, volume) {
      state.player.volume = volume;
    },
  },
});
