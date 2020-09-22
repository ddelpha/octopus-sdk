<template>
  <div class="d-flex w-100" v-if="live">
		<router-link class="live-date-box" :to="{ name: 'podcast', params: {podcastId:live.podcastId}, query:{productor: $store.state.filter.organisationId}}">
			<div class="font-weight-bold">{{date}}</div>
			<div class="font-weight-bold">{{hours}}</div>
			<div class="font-size-smaller">{{ $t('Duration', { duration: duration }) }}</div>
    </router-link>
		<router-link :to="{ name: 'podcast', params: {podcastId:live.podcastId}, query:{productor: $store.state.filter.organisationId}}">
			<PodcastImage
				class="mr-3"
				:class="fetchConference && fetchConference != 'null' && fetchConference.status ? fetchConference.status.toLowerCase()+'-shadow' : ''"
				v-bind:podcast="live" 
				:hidePlay='false'
				:playingPodcast='false'
				:fetchConference="fetchConference"
				:isAnimatorLive="organisationRight"/>
		</router-link>
		<div class="d-flex flex-column live-special-width">
			<router-link class="text-uppercase link-info text-truncate"
			:to="{ name: 'podcast', params: {podcastId:live.podcastId}, query:{productor: $store.state.filter.organisationId}}"
			>{{live.title}}</router-link>
			<router-link class="link-info text-truncate"
        :to="{ name: 'emission', params: {emissionId:live.emission.emissionId}, query:{productor: $store.state.filter.organisationId}}"
				>{{live.emission.name}}</router-link>
			<div class="four-line-clamp" v-if="description" v-html="description">{{description}}</div>
			<div class="comma" v-if="live.animators">{{ $t('Animated by : ') }}
				<router-link
					:aria-label="$t('Participant')"
					class="link-info"
					v-for="animator in live.animators"
					v-bind:key="animator.participantId"
					:to="{ name: 'participant', params: {participantId: animator.participantId}, query:{productor: $store.state.filter.organisationId}}"
				>{{ getName(animator) }}</router-link>
			</div>
			<div v-if="!isPodcastmaker">{{ $t('Producted by : ') }}
				<router-link
					class="link-info"
					:to="{ name: 'productor', params: {productorId:live.organisation.id}, query:{productor: $store.state.filter.organisationId}}"
				>{{ live.organisation.name }}</router-link>
			</div>
			<RecordingItemButton 
			:live="true" 
			:recording="fetchConference" 
			:podcast="live" 
			@deleteItem="deleteItem"
			v-if="fetchConference && organisationRight && isEditBox"
			></RecordingItemButton>
		</div>
  </div>
</template>

<style lang="scss">
.live-date-box{
	width : 200px;
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
}
.font-size-smaller{
	font-size: smaller;
}
.live-image-status{
	text-align: center;
	width: 100%;
	font-size: 0.6rem;
    padding: 0.2rem 0;
	color: white;
	text-transform: uppercase;
}
.four-line-clamp{
	display: block;
	max-width: 100%;
	height: 100px;
	font-size: 16px;
	line-height: 1.5;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}
.live-special-width{
	width: 0;
  flex-grow: 1;
}
.planned-bg {
	background: #f09653;
}
.pending-bg {
	background: #f1643e;
}
.recording-bg {
	background: #f34a4a;
}
.debriefing-bg {
	background: #6ec66e;
}
.done-bg {
	background: #679fe9;
}
.publishing-bg {
	background: #7d7d7d;
}
.planned-shadow {
	box-shadow: 0px 12px 48px 6px rgba(240, 151, 83, 0.2);
}
.pending-shadow {
	box-shadow: 0px 12px 48px 6px rgba(241, 101, 62, 0.2);
}
.recording-shadow {
	box-shadow: 0px 12px 48px 6px rgba(243, 74, 74, 0.2);
}
.debriefing-shadow {
	box-shadow: 0px 12px 48px 6px rgba(110, 198, 110, 0.2);
}
.publishing-shadow {
	box-shadow: 0px 12px 48px 6px rgba(125,125,125, 0.2);
}
</style>

<script>
import {state} from "../../../store/paramStore.js";
const moment = require('moment');
const humanizeDuration = require('humanize-duration');
/* import podcastApi from '@/api/podcasts'; */
import octopusApi from "@saooti/octopus-api";
import PodcastImage from "../podcasts/PodcastImage.vue";
import studioApi from '@/api/studio';
import RecordingItemButton from "@/components/display/studio/RecordingItemButton.vue";

export default {
  name: 'LiveItem',

  props: ['fetchConference', 'index'],

  components: {
		RecordingItemButton,
		PodcastImage
	},

	async created(){
		this.fetchPodcastData();
	},
  
  data() {
    return {
			live: undefined,
    };
  },

  computed: {
		isEditBox(){
      return state.podcastPage.EditBox;
    },
    isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },
    hours() {
      return moment(this.live.pubDate).format('À HH[H]mm');
		},
		date() {
      return moment(this.live.pubDate).format('D/MM/YYYY');
    },
    displayDate(){
      return moment(this.live.pubDate).format('X');
    },
    description() {
      if(this.live.description){
          return this.live.description;
      }else {
        return '';
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
        if (this.myOrganisationId === this.live.organisation.id) {
          return true;
        }
      }
      return false;
    },
    isAnimator() {
      return state.generalParameters.isAdmin || state.generalParameters.isAnimator;
    },
	
    duration() {
      if(this.live.duration > 1){
				if(this.live.duration > 600000){
          return humanizeDuration(this.live.duration, {
            language: 'fr',
            largest: 1,
            round: true,
          });
        }else{
          return humanizeDuration(this.live.duration, {
            language: 'fr',
            largest: 2,
            round: true,
          });
        }
      }else{
        return '';
      }
		},
  },
  methods:{
		getName(person) {
      const first = person.firstName || "";
      const last = person.lastName || "";
      return (first + " " + last).trim();
		},
		async fetchPodcastData(){
			if(this.fetchConference && this.fetchConference.podcastId){
				try {
					this.live = await octopusApi.fetchPodcast(this.fetchConference.podcastId);
				} catch {
					this.$emit('deleteItem', this.index);
					studioApi.deleteConference(this.$store, this.fetchConference.conferenceId);
				}
			}
		},
		deleteItem(){
			this.$emit('deleteItem', this.index);
		}
  }
};
</script>
