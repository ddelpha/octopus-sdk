<template>
  <div class="w-100 transition-height bg-dark" v-bind:style="{ height: playerHeight }">
    <div
      class="player-container"
      v-bind:style="{ height: playerHeight }"
      @transitionend="onHidden"
    >
      <div class="progress secondary-bg c-hand" @mouseup="seekTo" v-if="isBarTop">
          <div 
          class="progress-bar primary-bg" 
          role="progressbar" 
          aria-valuenow="0" 
          aria-valuemin="0" 
          aria-valuemax="100" 
          :style="'width: '+ percentProgress + '%'"
          ></div>
          <div class="player-progress-border"></div>
        </div>
      <div class="d-flex align-items-center justify-center flex-grow pr-5 pl-5">
      <audio
        id="audio-player"
        v-bind:src="podcastAudioURL"
        autoplay
        @timeupdate="onTimeUpdate"
        @ended="onFinished"
        @playing="onPlay"
        @durationChange="onTimeUpdate"
        @error="onError"
      />
      <router-link :to=podcastShareUrl v-if="isImage && podcastImage">
        <img
          v-bind:src="podcastImage"
          :alt="$t('Podcast image')"
          class="player-image c-hand"
        />
      </router-link>
      
      <div
        v-if='!playerError'
        class="play-button-box"
        v-bind:class="{
          'primary-bg': status != 'LOADING',
          'text-light': status != 'LOADING',
        }"
        @click="switchPausePlay"
      >
        <div
          class="text-light"
          :aria-label="$t('Play')"
          v-bind:class="{
            saooti: status == 'PLAYING' || status == 'PAUSED',
            'saooti-play2-bounty': status == 'PAUSED',
            'saooti-pause-bounty': status == 'PLAYING',
            loading: status == 'LOADING',
          }"
        ></div>
      </div>
      <div class="text-light player-grow-content">
        <div class="d-flex">
          <div class="text-warning player-title ml-2 mr-2" v-if='playerError'>{{ $t('Podcast play error') + " - "}}</div>
          <div class="flex-grow player-title">{{ podcastTitle }}</div>
          <div v-if="!playerError" v-show="!isBarTop" class="hide-phone">{{ playedTime }} / {{ totalTime }}</div>
        </div>
        <div class="progress c-hand" @mouseup="seekTo" style="height: 3px;" v-if="!playerError" v-show="!isBarTop">
          <div class="progress-bar primary-bg" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" :style="'width: '+ percentProgress + '%'"></div>
        </div>
      </div>
      <router-link :to=podcastShareUrl class="text-light hide-phone" v-if='podcastShareUrl !== ""' :aria-label="$t('Podcast')">
        <div class="saooti-export-bounty c-hand m-2" ></div>
      </router-link>
      <div class="d-flex text-light align-items-center hide-phone" v-if="isClock">
        <div class="saooti-clock-stud m-2" ></div>
        <div>{{actualTime}}</div>
      </div>
    </div>
    </div>
  </div>
</template>
<style lang="scss">
@import '../../sass/_variables.scss';

.play-button-box {
    height: 2.5rem;
    width: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.5rem;
    border-radius: 50%;
    font-size: 1.2rem;
    flex-shrink: 0;
    cursor: pointer;
}
.player-container {
  position: fixed;
  overflow: hidden;
  z-index: 10;
  width: 100%;
  bottom: 0;
  display: flex;
  flex-direction: column;
  transition: height 1s;
  background: #282828 !important;
  max-width: 100%;
  font-size: 1rem;

  .player-image {
    border-radius: 0.2rem;
    height: 2.4rem;
    width: 2.4rem;
  }
  .player-progress-border{
    height: 10px;
    width: 3px;
    background: black;
  }
  .progress{
    align-items: flex-end;
    height: 10px;
  }
  .progress-bar{
    height: 4px;
  }
  .player-title, .hide-phone {
    font-size: 0.8rem;
    margin: 0 0 5px 0;
  }
  .player-grow-content{
    display : flex;
    flex-grow: 1;
    flex-direction: column;
    flex-shrink: 1;
    flex-basis: 20px;
    overflow: hidden;
  }
  .player-title {
    font-size: 0.8rem;
    margin: 0 0 5px 0;
  }

  .hide-phone {
    font-size: 0.8rem;
    margin: 0 0 5px 0;
}
}
/** PHONES*/
@media (max-width: 960px) {
  .player-container{
    .d-flex{
      @media (max-width: 960px) {
        flex-wrap: nowrap !important;
      }
    }
    .player-title{
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>

<script>
import { mapState } from 'vuex';
import {state} from "../../store/paramStore.js";
import DurationHelper from '../../helper/duration';
import octopusApi from "@saooti/octopus-api";
const moment = require('moment');

export default {
  name: 'Player',

  data() {
    return {
      forceHide: false,
      actualTime: '',
      listenTime: 0,
      notListenTime: 0,
      lastSend:0,
      downloadId: undefined,
      new : true,
      saveCookie : undefined,
      playerError: false,
      listenError: false,
    };
  },
  mounted(){
    moment.locale('fr');
    if(this.isClock){
      setInterval(() => {
        this.actualTime = moment(new Date()).format("HH:mm:ss");
      }, 1000)
    }
    window.addEventListener('beforeunload', this.endListeningProgress);
    this.$store.watch((state) => state.player.status, (newValue) => {
      const audioPlayer = document.querySelector('#audio-player');
      if(newValue === 'PAUSED'){
        audioPlayer.pause();
      } else{
        audioPlayer.play();
      }
    })
  },

  computed: {
    isImage(){
      return state.player.image;
    },
    isEmissionName(){
      return state.player.emissionName;
    },
    isClock(){
      return state.player.clock;
    },
    isBarTop(){
      return state.player.barTop;
    },
    ...mapState({
      display: state => state.player.status != 'STOPPED',
      playerHeight(state) {
        if (state.player.status == 'STOPPED' || this.forceHide) {
          return 0;
        } else {
          return '5rem';
        }
      },
      status: state => state.player.status,
      podcast: state => state.player.podcast,
      media: state => state.player.media,
      volume: state => state.player.volume,

      podcastImage: state => {
        if (state.player.podcast) {
          return state.player.podcast.imageUrl;
        } else {
          return '';
        }
      },
      playedTime: state => {
        if (state.player.elapsed > 0 && state.player.total > 0) {
          return DurationHelper.formatDuration(
            Math.round(state.player.elapsed * state.player.total)
          );
        } else {
          return "--':--'";
        }
      },

      percentProgress: state => {
        return state.player.elapsed * 100;
      },

      totalTime: state => {
        if (state.player.elapsed > 0 && state.player.total > 0) {
          return DurationHelper.formatDuration(Math.round(state.player.total));
        } else {
          return "--':--'";
        }
      },
    }),
    podcastAudioURL(){
      if (this.podcast) {
        if(this.podcast.availability.visibility === false){
          return this.podcast.audioStorageUrl;
        }else{
          if(this.listenError){
            return this.podcast.audioStorageUrl;
          }else{
            let parameters = '?origin=octopus';
            parameters += "&cookieName=player_"+this.podcast.podcastId
            parameters +=
              this.$store.state.authentication && this.$store.state.authentication.organisationId
                ? '&distributorId=' + this.$store.state.authentication.organisationId
                : '';
            return this.podcast.audioUrl + parameters;
          }
        }
      } else if(this.media){
        return this.media.audioUrl;
      } else{
        return '';
      }
    },
    podcastShareUrl(){
      if (this.podcast) {
        return { name: 'podcast', params: {podcastId : this.podcast.podcastId}, query:{productor: this.$store.state.filter.organisationId}};
      } else {
        return '';
      }
    },

    podcastTitle(){
      if (this.podcast) {
        if(this.isEmissionName){
          return this.emissionName + ' - ' + this.podcast.title;
        }else{
          return this.podcast.title;
        }
      }else if(this.media){
        return this.media.title;
      } else {
        return '';
      }
    },

    emissionName(){
      if (this.podcast) {
        return this.podcast.emission.name;
      } else {
        return '';
      }
    },
  },

  methods: {
    onError(){
      if(this.podcast && !this.listenError){
        this.listenError = true;
      }else if(this.podcast || this.media){
        this.playerError = true;
      }
    },
    switchPausePlay() {
      const audioPlayer = document.querySelector('#audio-player');
      if (audioPlayer.paused) {
        this.onPlay();
      } else {
        this.onPause();
      }
    },

    seekTo(event) {
      const audioPlayer = document.querySelector('#audio-player');
      const rect = event.currentTarget.getBoundingClientRect();
      const barWidth = event.currentTarget.clientWidth;
      const x = event.clientX - rect.left; //x position within the element.

      const percentPosition = x / barWidth;
      const seekTime = this.$store.state.player.total * percentPosition;

      if(this.podcast){
        this.notListenTime = seekTime - this.listenTime;
      }
      audioPlayer.currentTime = seekTime;
    },

    onTimeUpdate(event) {
      if(this.podcast){
        if(this.new){
          this.new = false;
          this.startListeningProgress();
        }
        this.listenTime = event.currentTarget.currentTime - this.notListenTime;
      }
      const duration = event.currentTarget.duration;
      const currentTime = event.currentTarget.currentTime;
      if (duration && currentTime) {
        this.$store.commit('playerTotalTime', duration);
        this.$store.commit('playerElapsed', currentTime / duration);
      }
    },
    onPlay() {
      this.$store.commit('playerPause', false);
    },
    onPause() {
      this.$store.commit('playerPause', true);
    },

    onFinished() {
      if(this.podcast){
        this.endListeningProgress();
      }
      this.$data.forceHide = true;
    },

    onHidden() {
      if (this.$data.forceHide) {
        this.$store.commit('playerPlayPodcast');
        this.$data.forceHide = false;
      }
    },

    startListeningProgress(){
      if(this.downloadId){
        this.endListeningProgress();
      }
      this.loadDownloadId(0);
      ///Localhost/////////
      /* this.downloadId = "test"; */
      //////
    },

    loadDownloadId(index) {
      if(index < 5){
        setTimeout(()=>{
          let cookiestring = RegExp("player_"+ this.$store.state.player.podcast.podcastId +"=[^;]+").exec(document.cookie);
          if(cookiestring !== null){
            this.downloadId = decodeURIComponent(cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
          } else{
            this.loadDownloadId(index + 1);
          }
        }, 500);
      }
    },

    endListeningProgress(){
      if(this.downloadId){
        octopusApi.updatePlayerTime(this.downloadId, Math.round(this.listenTime));
        this.downloadId = undefined;
        this.notListenTime = 0;
        this.lastSend = 0;
        this.listenTime = 0;
      }
    }
  },
  watch: {
    playerHeight(newVal){
      this.$emit('hide', newVal=== 0? true : false);
    },
    podcast(){
      this.listenError=false;
    },
    podcastAudioURL(newVal){
      this.playerError=false;
      if(this.podcast && newVal !== ""){
        this.new = true;
      }
    },
    listenTime(newVal){
      if(this.podcast && newVal - this.lastSend >= 10 && this.downloadId){
        this.lastSend = newVal;
        octopusApi.updatePlayerTime(this.downloadId, Math.round(newVal));
      }
    },
  }
}; 
</script>
