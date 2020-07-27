<template>
  <div class="d-flex w-100">
		<div class="live-date-box">
			<div class="font-weight-bold">{{date}}</div>
			<div class="font-weight-bold">{{hours}}</div>
			<div class="font-size-smaller">{{ $t('Duration', { duration: duration }) }}</div>
		</div>
		<div
			class="img-box rounded-lg flex-shrink live-box-shadow"
			:style="{ 'background-image': 'url(\'' + live.imageUrl +'?dummy='+dummyParam+  '\')' }"
			v-if="live"
		>
			<div class="live-image-status" :class="live.processingStatus ? live.processingStatus.toLowerCase()+'-bg' : ''" v-if="status">{{status}}</div>
		</div>
		<div class="d-flex flex-column live-special-width">
			<div class="text-uppercase primary-color font-weight-bold text-truncate">{{live.title}}</div>
			<div class="primary-color font-weight-bold text-truncate">{{live.emission.name}}</div>
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
			<RecordingItemButton :live="true" :recording="live" v-if="editRight && isEditBox"></RecordingItemButton>
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
	font-weight: bold;
	color: white;
	text-transform: uppercase;
}
.live-box-shadow{
	margin: 0 1rem;
	box-shadow: 0px 12px 48px 6px rgba(255, 132, 87, 0.5) !important;
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
.ready-bg {
	background: #f09653;
}
.preparing-bg {
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
</style>

<script>
import {state} from "../../../store/paramStore.js";
const moment = require('moment');
const humanizeDuration = require('humanize-duration');
import RecordingItemButton from "@/components/display/studio/RecordingItemButton.vue";

export default {
  name: 'LiveItem',

  props: ['live'],

  components: {
		RecordingItemButton
  },
  
  data() {
    return {
			dummyParam : new Date().getTime().toString(),
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
		organisationId(){
      return state.generalParameters.organisationId;
		},
		authenticated(){
      return state.generalParameters.authenticated;
    },
		editRight() {
      if (this.authenticated) {
        if (this.organisationId === this.live.organisation.id) {
          return true;
        }
        if (state.generalParameters.isAdmin) {
          return true;
        }
      }
      return false;
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
		status(){
			switch (this.live.processingStatus) {
				case 'READY': return this.$t('live upcoming');
        case "PREPARING":
          return this.$t("Planning");
        case "PENDING":
          return this.$t('live upcoming');
        case "RECORDING":
          return this.$t("In live");
        case "DEBRIEFING":
          return this.$t("Debriefing");
        default:
          return "";
			}
		}
  },
  methods:{
		getName(person) {
      const first = person.firstName || "";
      const last = person.lastName || "";
      return (first + " " + last).trim();
    },
  }
};
</script>