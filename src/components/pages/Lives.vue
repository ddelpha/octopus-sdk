<template>
  <div class="page-box">
    <div class="d-flex flex-column align-items-center mb-3">
        <h1>{{$t('In live')}}</h1>
        <router-link to="/main/priv/edit/live" v-if="liveRight">
          <button class="btn btn-primary">{{ $t('Launch a new live') }}</button>
        </router-link>
    </div>
		<LiveList @initConferenceIds="initConferenceIds" :conferenceWatched="conferenceWatched"/>
  </div>
</template>
<style lang="scss">
</style>
<script>
// @ is an alias to /src
import {state} from "../../store/paramStore.js";
import LiveList from "../display/live/LiveList.vue";

export default {
  components: {
		LiveList
  },
  props:{
    conferenceWatched: { default: [] }, 
  },

  created() {
    if (this.$route.query.productor) {
      this.$data.organisationId = this.$route.query.productor;
    } else if (this.$store.state.filter.organisationId) {
      this.$data.organisationId = this.$store.state.filter.organisationId;
    }
    if(!this.$store.state.organisation.attributes['live.active']){
      this.live=false;
    }
  },

  data() {
    return {
      live: true,
    };
  },

  computed:{
    authenticated(){
      return state.generalParameters.authenticated;
    },
    liveRight() {
      if (this.authenticated && this.live && this.isAnimator) {
        return true;
      }
      return false;
    },
    isAnimator() {
      return this.$store.state.authentication.role.includes("ADMIN") || this.$store.state.authentication.role.includes("ANIMATOR");
    }
  },

  methods:{
    initConferenceIds(listIds){
      this.$emit('initConferenceIds', listIds);
    }
  }
};
</script>
