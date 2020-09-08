<template>
  <div class="d-flex flex-column align-items-center live-list-container" v-if="filterOrga">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border mr-3"></div>
      <h3 class="mt-2">{{ $t('Loading lives...') }}</h3>
    </div>
    <div v-if="loaded && (!lives.length && !livesToBe.length && !livesTerminated.length)">
      <p>{{ $t('No live currently') }}</p>
    </div>
    <div v-if="loaded && displayNextLiveMessage">
      <h3 class="text-danger">{{ displayNextLiveMessage }}</h3>
    </div>
    <template v-if="lives.length">
      <div class="horizontal-separator"></div>
      <p class="live-list-category">{{$t('In live')}}</p>
      <LiveItem
        class="mt-3"
        v-for="(l, index) in lives"
        :fetchConference="l"
        :key="l.podcastId"
        :index="index"
        @deleteItem="deleteLive"
      />
    </template>
    <template v-if="livesToBe.length">
      <div class="horizontal-separator"></div>
      <p class="live-list-category">{{$t('Live to be')}}</p>
      <LiveItem
        class="mt-3"
        v-for="(l, index) in livesToBe"
        :fetchConference="l"
        :key="l.podcastId"
        :index="index"
        @deleteItem="deleteLiveToBe"
		/>
    </template>
    <template v-if="livesTerminated.length">
      <div class="horizontal-separator"></div>
      <p class="live-list-category">{{$t('Live terminated')}}</p>
      <LiveItem
        class="mt-3"
        v-for="(l, index) in livesTerminated"
        :fetchConference="l"
        :key="l.podcastId"
        :index="index"
        @deleteItem="deleteLiveTerminated"
      />
    </template>
    <template v-if="livesError.length">
      <div class="horizontal-separator"></div>
      <p class="live-list-category">{{$t('In error')}}</p>
      <LiveItem
        class="mt-3"
        v-for="(l, index) in livesError"
        :fetchConference="l"
        :key="l.podcastId"
        :index="index"
        @deleteItem="deleteLiveError"
      />
    </template>
  </div>
</template>

<style lang="scss">
.live-list-container .horizontal-separator{
  border-top: 1px solid #cccccc;
  width: 100%;
  margin: 2rem;
}
.live-list-category{
  align-self: flex-start;
  text-transform: uppercase;
  font-weight: bold;
}
</style>

<script>
import studioApi from '@/api/studio';
import LiveItem from './LiveItem.vue';
const moment = require('moment');
import {state} from "../../../store/paramStore.js";

export default {
  name: 'LiveList',

  props:{
    conferenceWatched: { default: [] }, 
  },

  components: {
    LiveItem,
  },

  created() {
    this.fetchContent();
  },

  data() {
    return {
      loading: true,
      loaded: true,
      lives: [],
      livesToBe: [],
      livesTerminated: [],
      livesError: [],
    };
  },

  computed: {
    filterOrga(){
      return this.$store.state.filter.organisationId;
    },
    displayNextLiveMessage(){
      if(this.lives.length === 0 && this.livesToBe.length > 0){
        return this.$t('Next live date',{date : moment(this.livesToBe[0].date).format('LLLL')});
      }else{
        return "";
      }
    },
    authenticated(){
      return state.generalParameters.authenticated;
    },
    myOrganisationId(){
      return state.generalParameters.organisationId;
    },
		organisationRight() {
      if (this.authenticated && this.isAnimator) {
        if (this.myOrganisationId === this.filterOrga) {
          return true;
        }
      }
      return false;
    },
    isAnimator() {
      return state.generalParameters.isAdmin || state.generalParameters.isAnimator;
    },
  },

  methods: {
    async fetchContent() {
      if(this.filterOrga){
        this.loading = true;
        this.loaded = false;
        let dataLives = await studioApi.listConferences(this.$store, true, this.filterOrga, 'RECORDING');
        this.lives = dataLives.filter((p)=>{return p!== null;});
        let dataLivesToBe = await studioApi.listConferences(this.$store, true, this.filterOrga, 'PENDING');
        let dataLivesPlanned = await studioApi.listConferences(this.$store, true, this.filterOrga, 'PLANNED');
        this.livesToBe = dataLivesToBe.concat(dataLivesPlanned).filter((p)=>{return p!== null;});
        if(this.organisationRight){
          let dataLivesTerminated = await studioApi.listConferences(this.$store, true, this.filterOrga, 'DEBRIEFING');
          this.livesTerminated = dataLivesTerminated.filter((p)=>{return p!== null;});
          let dataLivesError = await studioApi.listConferences(this.$store, true, this.filterOrga, 'ERROR');
          this.livesError = dataLivesError.filter((p)=>{return p!== null;});
        }
        this.loading = false;
        this.loaded = true;
        let listIds= this.lives.concat(this.livesToBe);
        this.$emit('initConferenceIds', listIds);
      }
    },
    deleteLive(index){
      this.lives.splice(index,1);
    },
    deleteLiveToBe(index){
      this.livesToBe.splice(index,1);
    },
    deleteLiveTerminated(index){
      this.livesTerminated.splice(index,1);
    },
    deleteLiveError(index){
      this.livesError.splice(index,1);
    },
    updateLiveLocal(){
      for (let index = 0; index < this.conferenceWatched.length; index++) {
        const element = this.conferenceWatched[index];
        let indexLivesToBe = this.livesToBe.findIndex((el)=>el.conferenceId === element.conferenceId);
        if(indexLivesToBe !== -1){
          if(element.status === "RECORDING"){
            let newConf = this.livesToBe[indexLivesToBe];
            newConf.status = element.status;
            this.livesToBe.splice(indexLivesToBe,1);
            this.lives.push(newConf);
            break;
          }
        }else{
          let indexLives = this.lives.findIndex((el)=>el.conferenceId === element.conferenceId);
          if(indexLives !== -1 && element.status === "DEBRIEFING"){
            let newConf = this.lives[indexLives];
            newConf.status = element.status;
            this.lives.splice(indexLives,1);
            this.livesTerminated.push(newConf);
            break;
          }
        }
      }
    }
  },

  watch: {
    filterOrga(){
      if(!this.filterOrga){
        this.$router.push('/');
      }
    },
    conferenceWatched:{
      handler() {
        this.updateLiveLocal();
      },
      deep:true,
    }
  },
};
</script>
