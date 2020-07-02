<template>
  <div class="default-multiselect-width" :style="{ width: width }">
    <label for="rubriqueChooser" class="d-inline" aria-label="select rubrique"></label>
    <Multiselect
      v-model="rubrique"
      id="rubriqueChooser"
      label="name"
      track-by="rubriqueId"
      :placeholder="$t('Type string to filter by rubrics')"
      :options="rubriques"
      :multiple="multiple"
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
      @open="clearAll"
      @search-change="onSearchRubrique"
      @close="onClose"
      @select="onRubriqueSelected"
    >
      <template slot="singleLabel" slot-scope="props">
        <div class="multiselect-octopus-proposition">
          <span class="option__title">
            {{ props.option.name }}
          </span>
        </div>
      </template>
      <template slot="option" slot-scope="props">
        <div class="multiselect-octopus-proposition" :class="props.option.rubriqueId <=0 ? 'primary-dark':''" :data-selenium='"rubric-chooser-"+seleniumFormat(props.option.name)'>
          <span class="option__title">{{ props.option.name }}</span>
        </div>
      </template>
      <template slot="noOptions">{{ $t('List is empty') }}</template>
      <span slot="noResult">
        {{ $t('No elements found. Consider changing the search query.') }}
      </span>
      <span class="saooti-arrow_down octopus-arrow-down octopus-arrow-down-top" slot="caret"></span>
    </Multiselect>
  </div>
</template>

<style lang="scss">
</style>
<script>
import Vue from "vue";
import Multiselect from 'vue-multiselect';

const getDefaultRubrique = defaultName => {
  if(defaultName !== undefined){
    return {name: defaultName, rubriqueId: 0};
  } else {
    return '';
  }
};

export default {
  components: {
    Multiselect,
  },

  props: { 
    width: { default: '100%' },
    defaultanswer: { default: undefined },
    rubriqueSelected: {default: undefined},
    multiple: {default: false},
    rubriqueArray: {default: undefined},
    rubriquageId: {default:undefined},
    allRubriques: {default: []},
    reset: {default: false},
    withoutRubrique: {default:false}
  },

  data() {
    return {
      rubriques: [],
      rubrique: getDefaultRubrique(this.defaultanswer),
      isLoading: false,
      withoutItem: {name: this.$t('Without rubric'), rubriqueId: -1}
    };
  },

  mounted() {
    if(this.rubriqueSelected !== undefined){
      this.initRubriqueSelected(this.rubriqueSelected);
    }
    if(this.rubriqueArray !== undefined){
      this.initRubriqueArray(this.rubriqueArray);
    }
  },

  methods: {
    seleniumFormat(string){
      return Vue.seleniumFormat(string);
    },
    clearAll() {
      if(this.rubriqueArray === undefined) {
        this.rubrique = '';
      } 
      if(this.defaultanswer !== undefined){
        if(this.withoutRubrique){
          this.rubriques = [getDefaultRubrique(this.defaultanswer),this.withoutItem].concat(
            this.allRubriques
          );
        }else{
          this.rubriques = [getDefaultRubrique(this.defaultanswer)].concat(
            this.allRubriques
          );
        }
      } else {
        this.rubriques = this.allRubriques;
      }
    },

    onClose() {
      if (!this.rubrique && this.rubriqueArray === undefined) {
        if(this.defaultanswer !== undefined){
          this.rubrique = getDefaultRubrique(this.defaultanswer);
        } else{
          this.rubrique = '';
        }
        this.onRubriqueSelected(this.rubrique);
      }
    },

    onSearchRubrique(query) {
      this.isLoading = true;
      let list;
      if(this.defaultanswer !== undefined){
        if(this.withoutRubrique){
          list = [getDefaultRubrique(this.defaultanswer), this.withoutItem].concat(
            this.allRubriques
          );
        }else{
          list = [getDefaultRubrique(this.defaultanswer)].concat(
            this.allRubriques
          );
        }
      } else{
        list = this.allRubriques;
      }
      this.rubriques = list.filter(item => {
        return item.name.toUpperCase().includes(query.toUpperCase());
      });
      this.isLoading = false;
    },

    onRubriqueSelected(rubrique) {
      if(this.rubriqueSelected !== undefined){
        this.$emit('update:rubrique', rubrique.rubriqueId);
      } else if(this.rubriqueArray === undefined){
        this.$emit('selected', rubrique);
      }
    },
    initRubriqueSelected(val){
      this.rubrique = this.allRubriques.find((el)=>{
        return el.rubriqueId === val;
      });
    },
    initRubriqueArray(val){
      this.rubrique = [];
      val.forEach(element => {
        let item =  this.allRubriques.find((el)=>{
          return el.rubriqueId === element;
        })
        this.rubrique.push(item);
      }); 
    }
  },
  watch:{
    rubriqueSelected(newVal) {
      this.initRubriqueSelected(newVal);
    },
    rubrique(newVal) {
      if(this.rubriqueArray !== undefined){
        let idsArray = [];
        newVal.forEach((el)=>{
          idsArray.push(el.rubriqueId);
        })
        this.$emit('selected', idsArray);
      }
    },
    reset() {
      this.rubrique = getDefaultRubrique(this.defaultanswer);
    },
  }
};
</script>
