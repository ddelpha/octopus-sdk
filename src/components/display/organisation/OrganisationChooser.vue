<template>
  <div class="default-multiselect-width" :style="{ width: width }" :class="{'multiselect-hide-arrow' : !displayArrow }" v-if='!value ||init'>
    <label for="organisationChooser" class="d-inline" aria-label="select productor"></label>
    <Multiselect
      v-model="organisation"
      id="organisationChooser"
      label="name"
      track-by="organisationId"
      :placeholder="$t('Type string to filter by organisation')"
      :options="organisations"
      :multiple="false"
      :searchable="true"
      :loading="isLoading"
      :internal-search="false"
      :clear-on-select="false"
      :close-on-select="true"
      :options-limit="200"
      :max-height="600"
      :show-no-results="true"
      :hide-selected="true"
      :show-labels="false"
      @search-change="onSearchOrganisation"
      @open="onOpen"
      @close="onClose"
      @select="onEmissionSelected"
      :class="{'light-multiselect' : stats}"
    >
      <template slot="clear" slot-scope="props">
        <div
          class="multiselect__clear"
          v-if="organisation.length"
          @mousedown.prevent.stop="clearAll(props.search)"
        ></div>
      </template>
      <template slot="singleLabel" slot-scope="props">
        <div class="multiselect-octopus-proposition">
          <img
            v-if="!light"
            class="option__image"
            :src="props.option.imageUrl"
            :alt="props.option.name"
          />
          <span class="option__title" :class="{'descriptionText' : light}">
            {{ props.option.name }}
          </span>
        </div>
      </template>
      <template slot="option" slot-scope="props">
        <div class="multiselect-octopus-proposition">
          <img
            v-if="!light"
            class="option__image"
            :src="props.option.imageUrl"
            :alt="props.option.name"
          />
          <span class="option__title" :class="{'descriptionText' : light}">
            {{ props.option.name }}
          </span>
        </div>
      </template>
      <span slot="noResult">
        {{ $t('No elements found. Consider changing the search query.') }}
      </span>
      <template slot="afterList">
        <div v-if="remainingElements" class="multiselect-remaining-elements">
          {{
            $t(
              'Count more elements matched your query, please make a more specific search.',
              { count: remainingElements }
            )
          }}
        </div>
      </template>
      <template slot="noOptions">{{ $t('List is empty') }}</template>
      <span v-if='!light' class="saooti-arrow_down octopus-arrow-down-2" :class="{'octopus-arrow-down-top' : stats}" slot="caret"></span>
    </Multiselect>
  </div>
</template>

<style lang="scss">

</style>

<script>
import Multiselect from 'vue-multiselect';
import octopusApi from "@saooti/octopus-api";
import {state} from "../../../store/paramStore.js";

const ELEMENTS_COUNT = 200;
const DEFAULT_ORGANISATION_ID = 0;
const DEFAULT_ORGANISATION_IMAGE = '/img/emptypodcast.png';

const getDefaultOrganistion = defaultName => {
  return {
    name: defaultName,
    id: DEFAULT_ORGANISATION_ID,
    imageUrl: DEFAULT_ORGANISATION_IMAGE,
  };
};

export default {
  components: {
    Multiselect,
  },

  created() {
    if(this.authenticated && this.$store.state.organisation.imageUrl === undefined){
      octopusApi.fetchOrganisation(this.organisationId)
      .then(data => {
          this.myImage = data.imageUrl;
      })
    }
    if(this.value){
      this.fetchOrganisation();
    }
  },

  props: { 
    width: { default: '100%' }, 
    defaultanswer: { default: false }, 
    stats : {default: false},
    displayArrow: { default: true },
    value: { default: null },
    light: {default: false},
    reset: {default:false},
    },

  data() {
    let _return = {
      organisation: '',
      organisations: [],
      remainingElements: 0,
      isLoading: false,
      init: false,
      myImage: state.organisation.imageUrl
    };
    if (this.defaultanswer) {
      _return['organisation'] = getDefaultOrganistion(this.defaultanswer);
    }
    return _return;
  },

  computed:{
    organisationId(){
      return state.generalParameters.organisationId;
    },
    authenticated(){
      return state.generalParameters.authenticated;
    },
    myOrganisation(){
      if(this.authenticated){
        return {
          id: this.organisationId,
          imageUrl: this.myImage,
          name: this.$t('Edit my organisation') + ' (' + state.organisation.name +')',
        };
      }else {
        return undefined;
      }
    }
  },

  methods: {

    onOpen() {
      this.clearAll();
      this.onSearchOrganisation();
    },

    onClose() {
      if (!this.organisation) {
        this.organisation = this.defaultanswer
          ? getDefaultOrganistion(this.defaultanswer)
          : '';
        this.$emit('selected', this.organisation);
      }
    },

    onEmissionSelected(organisation) {
      this.$emit('selected', organisation);
    },

    onSearchOrganisation(query) {
      this.isLoading = true;
      octopusApi
        .fetchOrganisations( {
          query: query,
          first: 0,
          size: ELEMENTS_COUNT,
        })
        .then(response => {
          if (this.defaultanswer) {
            this.organisations = [
              getDefaultOrganistion(this.defaultanswer),
            ].concat(response.result);
          } else {
            this.organisations = response.result;
          }
          if(this.myOrganisation){
            if(query === undefined){
              this.organisations = this.organisations.filter(obj => {
                return obj.id !== this.organisationId;
              });
              this.organisations.splice(1, 0, this.myOrganisation);
            } else {
              let foundIndex = this.organisations.findIndex(obj => obj.id === this.organisationId);
              if(foundIndex){
              this.organisations[foundIndex] = this.myOrganisation; 
              }
            }
          }
          this.isLoading = false;
          this.remainingElements = Math.max(0, response.count - ELEMENTS_COUNT);
        });
    },

    fetchOrganisation(){
      if(this.organisations.length ===0){
        this.onSearchOrganisation();
      }
      octopusApi.fetchOrganisation(this.value)
      .then(data => {
          this.organisation = data;
          this.init = true;
      })
    },

    clearAll() {
      this.organisation = '';
      this.organisations = [];
    },
  },

  watch:{
    value(newVal){
      if(!this.init || newVal){
        this.fetchOrganisation();
      }
    },
    reset(){
      this.organisation = this.defaultanswer
        ? getDefaultOrganistion(this.defaultanswer)
        : '';
    }
  }
};
</script>
