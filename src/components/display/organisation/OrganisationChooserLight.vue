<template>
  <div class="default-multiselect-width" :style="{ width: width }" v-if='(!value ||init) && organisation !== ""'>
    <select id="organisation_chooser_light" class="basic-select mb-0 c-hand" v-model='actual' @change="onOrganisationSelected">
			<option :value="organisation.id">{{organisation.name}}</option>
			<option :value="-1">{{$t('No organisation filter')}}</option>
    </select>
    <label for="organisation_chooser_light" class="d-inline" :aria-label="$t('select productor')"></label>
  </div>
</template>

<style lang="scss">
.default-multiselect-width .basic-select {
	width: auto;
	-webkit-appearance: none;
	-moz-appearance: none;
	text-indent: 1px;
	text-overflow: '';
	font-size: 1rem;
}
</style>

<script>
import octopusApi from "@saooti/octopus-api";

export default {
  components: {
  },

  created() {
    if(this.value){
      this.fetchOrganisation();
    }
  },

  props: { 
    width: { default: '100%' }, 
    value: { default: null },
    reset: {default:false},
  },

  data() {
    let _return = {
			actual: -1,
      organisation: '',
      init: false,
    };
    return _return;
  },

  computed:{
  },

  methods: {
    onOrganisationSelected() {
			if(this.actual === -1){
				this.$emit('selected', undefined);
			}else{
				this.$emit('selected', this.organisation);
			}
    },
    fetchOrganisation(){
      octopusApi.fetchOrganisation(this.value)
      .then(data => {
				this.organisation = data;
				this.actual = data.id;
				this.init = true;
      })
    },
  },

  watch:{
    value(newVal){
      if(!this.init || newVal){
        this.fetchOrganisation();
      }
    },
    reset(){
      this.actual = -1;
    }
  }
};
</script>
