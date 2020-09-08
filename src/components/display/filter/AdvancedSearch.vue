<template>
<div>
	<div class="d-flex justify-content-center mb-3" @click="showFilters = !showFilters">
		<div class="text-secondary c-hand">{{$t('Advanced filters')}}</div>
		<div class="text-secondary c-hand align-self-center large-font-size" :class="{'arrow-transform':showFilters}">
			<div class="saooti-arrow_down saooti-arrow_down-margin"></div>
		</div>
	</div>
  <div class="advanced-search-container" v-show="showFilters" >
		<div class="d-flex flex-column">
			<div class="primary-color mb-2" v-if="isEmission">{{$t('Filter')}}</div>
			<MonetizableFilter @updateMonetization='updateMonetization' :isEmission='isEmission' v-if="isMonetizableFilter"/>
			<div class="d-flex mt-3 align-items-center rubrique-select-height" v-if="organisationId && rubriquageDisplay">
				<div class="checkbox-saooti flex-shrink">  
					<input type="checkbox" class="custom-control-input" id="search-rubriquage-checkbox" v-model="isRubriquage">  
					<label class="custom-control-label" for="search-rubriquage-checkbox">{{ $t('By topic') }}</label>  
				</div>
				<template v-if="isRubriquage">
					<label class="wrap">
						<select class="basic-select ml-2 mb-0 border c-hand" v-model="rubriquageId" @change="onRubriquageSelected">
							<option :value="-1" class="primary-dark">{{$t('Without topic')}}</option>
							<option 
								v-for="rubriquage in rubriquageData" 
								v-show="rubriquage.rubriques.length !== 0"
								:key="rubriquage.rubriquageId" 
								:value="rubriquage.rubriquageId"
							>{{rubriquage.title}}</option>
						</select>
						<div class="saooti-arrow_down octopus-arrow-down-2 classic-select"></div>
					</label>
					<template v-if="rubriquageId && rubriquageId !== -1">
						<div class="ml-3 flex-shrink">{{$t('By rubric')}}</div>
						<RubriqueChooser 
							class="ml-2"
							:multiple='false' 
							:rubriquageId='rubriquageId' 
							:allRubriques='getRubriques(rubriquageId)' 
							:defaultanswer='$t("No rubric filter")'
							:reset='reset'
							:withoutRubrique='true'
							width='auto'
							@selected="onRubriqueSelected"		
						/>
					</template>
				</template>
			</div>
			<div class="d-flex mt-3 align-items-center">
				<div class="mr-2" v-if="isEmission">{{$t('Emission with episode published :')}}</div>
				<div class="checkbox-saooti flex-shrink">  
					<input type="checkbox" class="custom-control-input" id="search-from-checkbox" v-model="isFrom">  
					<label class="custom-control-label" for="search-from-checkbox">{{ $t('From the :') }}</label>  
				</div>
				<Datetime
					type="datetime"
					moment-locale="fr"
					v-model="fromDate"
					class="theme-saooti pl-3"
					@input="updateFromDate"
					input-format="D/MM/YYYY [à] HH[h]mm"
					:i18n="lang"
				/>
				<div class="checkbox-saooti flex-shrink ml-3">  
					<input type="checkbox" class="custom-control-input" id="search-to-checkbox" v-model="isTo">  
					<label class="custom-control-label" for="search-to-checkbox">{{ $t('To the :') }}</label>  
				</div>
				<Datetime
					type="datetime"
					moment-locale="fr"
					v-model="toDate"
					class="theme-saooti pl-3"
					@input="updateToDate"
					input-format="D/MM/YYYY [à] HH[h]mm"
					:i18n="lang"
				/>
			</div>
			<div class="d-flex flex-column mt-3" v-if="organisation && organisationRight && !isPodcastmaker">
				<div class="checkbox-saooti flex-shrink">  
					<input type="checkbox" class="custom-control-input" id="search-future-checkbox" v-model="isNotVisible">  
					<label class="custom-control-label" for="search-future-checkbox">{{ textNotVisible }}</label>  
				</div>
			</div>
		</div>
		<div class="d-flex flex-column ml-3" v-if="isEmission">
			<div class="primary-color mb-2 padding-left-custom-radio">{{$t('Sort')}}</div>
			<b-form-group>
				<b-form-radio-group v-model="emissionSort" class="d-flex flex-column">
					<b-form-radio value="SCORE">{{$t('Sort score')}}</b-form-radio>
					<b-form-radio value="LAST_PODCAST_DESC">{{$t('Sort last')}}</b-form-radio>
					<b-form-radio value="NAME">{{$t('Sort name')}}</b-form-radio>
				</b-form-radio-group>
			</b-form-group>
		</div>
  </div>
</div>
</template>
<style lang="scss">
input {
    border: 0.1rem solid #dee2e6;
    border-radius: 0.3rem;
    padding: 0.5rem;
}
.saooti-arrow_down-margin {
	margin: 3px 0 0;
}
.padding-left-custom-radio{
	padding-left: 1.5rem;
}
.large-font-size{
  font-size: 1.3rem;
}
.arrow-transform{
  transform: rotate(180deg);
}
.advanced-search-container{
	background: #fff;
  border-radius: 0.8rem;
	display: flex;
  width: 100%;
	padding: 1rem 2rem;
	margin-bottom: 1rem;
	label.wrap { 
		position: relative;
		margin:0;
	}
	input:not(#rubriqueChooser){
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 0.2em 0.5em;
	}
	select{       
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
	}
	.rubrique-select-height{
		height: 30px;
	}
}

</style>
<script>
// @ is an alias to /src

import MonetizableFilter from './MonetizableFilter.vue';
import RubriqueChooser from '../rubriques/RubriqueChooser.vue';
import { Datetime } from 'vue-datetime';
import {state} from "../../../store/paramStore.js";
import octopusApi from "@saooti/octopus-api";
const moment = require('moment');
 
export default {
  components: {
		MonetizableFilter,
		RubriqueChooser,
		Datetime
	},
	
	props: ['organisationId', 'isEmission', 'resetRubriquage'],

  created() {
		this.fetchTopics();
	},
	
	mounted(){
		if(this.organisation && this.organisationRight && !this.isEmission){
				this.isNotVisible = true;
		}
	},

  data() {
    return {
			isRubriquage:false,
			rubriquageId : undefined,
			rubriqueId : undefined,
			rubriquageData: [],
			isFrom: false,
			isTo: false,
			lang: {
        ok: this.$t('Validate'),
        cancel: this.$t('Cancel'),
			},
			fromDate: moment().subtract(10, "days").toISOString(),
			toDate: moment().toISOString(),
			isNotVisible: false,
			showFilters : false,
			reset: false,
			emissionSort: 'LAST_PODCAST_DESC',
    };
  },

  computed:{
    isMonetizableFilter(){
      return state.podcastsPage.MonetizableFilter;
		},
		rubriquageDisplay(){
			if(this.rubriquageData.length !== 0){
				let found = false;
				for (let index = 0; index < this.rubriquageData.length; index++) {
					if(this.rubriquageData[index].rubriques.length !== 0){
						found = true;
						break;
					}
				}
				return found;
			}
			return false;
		},
		myOrganisationId(){
      return state.generalParameters.organisationId;
    },
    authenticated(){
      return state.generalParameters.authenticated;
    },
		organisationRight() {
      if (this.authenticated) {
        if (this.myOrganisationId === this.organisationId) {
          return true;
        }
        if (state.generalParameters.isAdmin) {
          return true;
        }
      }
      return false;
		},
		isPodcastmaker(){
      return state.generalParameters.podcastmaker;
		},
		filterOrga(){
      return this.$store.state.filter.organisationId;
    },
    organisation(){
      if(this.organisationId){
        return this.organisationId;
      }else if(this.filterOrga){
        return this.filterOrga;
      }else {
        return undefined;
      }
		},
		textNotVisible(){
			if(this.isEmission){
				return this.$t('Consider podcasts no visible');
			} else{
				return this.$t('See podcasts no visible');
			}
		}
  },

  methods:{
		updateFromDate(){
			if(moment(this.fromDate).startOf('minute').toISOString() !== moment().subtract(10, "days").startOf('minute').toISOString()){
				if(this.isFrom){
					this.$emit('updateFromDate', this.fromDate);
				}else{
					this.isFrom = true;
				}
			}
		},
		updateToDate(){
			if(moment(this.toDate).startOf('minute').toISOString() !== moment().startOf('minute').toISOString()){
				if(this.isTo){
					this.$emit('updateToDate', this.toDate);
				}else{
					this.isTo = true;
				}
			}
		},
		getRubriques(rubriquageId){
			let topicIndex = this.rubriquageData.findIndex(element => element.rubriquageId === rubriquageId);
			return this.rubriquageData[topicIndex].rubriques;
		},
		onRubriqueSelected(rubrique){
			if(rubrique.rubriqueId !== this.rubriqueId){
				this.rubriqueId = rubrique.rubriqueId;
				if(this.rubriqueId === 0){
					this.$emit('updateRubrique', undefined);
				}else{
					this.$emit('updateRubrique', rubrique.rubriqueId);
				}
			}
		},
		onRubriquageSelected(){
			this.reset = !this.reset;
			this.rubriqueId = 0;
			if(this.isRubriquage){
				this.$emit('updateRubriquage', this.rubriquageId);
			}
		},
    updateMonetization(value){
      this.$emit('updateMonetization', value);
		},
		async fetchTopics(){
			if(this.organisation){
				const data = await octopusApi.fetchTopics(this.organisation);
				this.rubriquageData = data;
				if(data.length !== 0){
					for (let index = 0; index < this.rubriquageData.length; index++) {
						if(this.rubriquageData[index].rubriques.length !== 0){
							this.rubriquageId = this.rubriquageData[index].rubriquageId;
							break;
						}
					}
				}
			}
		},
	},
	watch:{
		organisation(){
			if(this.organisation && this.organisationRight && !this.isEmission){
				this.isNotVisible = true;
			}else{
				this.isNotVisible = false;
			}
			this.fetchTopics();
		},
		isFrom(newVal){
			if(newVal){
				this.$emit('updateFromDate', this.fromDate);
			}else{
				this.$emit('updateFromDate', undefined);
			}
		},
		isTo(newVal){
			if(newVal){
				this.$emit('updateToDate', this.toDate);
			}else{
				this.$emit('updateToDate', undefined);
			}
		},
		isRubriquage(newVal){
			if(newVal){
				this.$emit('updateRubriquage', this.rubriquageId);
			}else{
				this.$emit('updateRubriquage', undefined);
				this.$emit('updateRubrique', undefined);
			}
		},
		emissionSort(newVal){
			this.$emit('updateSortEmission', newVal);
		},
		resetRubriquage(){
			this.isRubriquage = false;
		},
		isNotVisible(newVal){
			this.$emit('includeHidden', newVal);
		}
	}
};
</script>
