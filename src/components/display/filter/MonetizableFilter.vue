<template>
	<div class="d-flex align-items-center">
		<div>{{$t('Advertising') + ' :'}}</div>
		<label class="wrap">
			<select ref="select" class="basic-select ml-2 mb-0 border c-hand" v-model="monetization" @change="onChange">
				<option value="UNDEFINED" v-if="isEmission">{{ $t('All emissions') }}</option>
				<option value="UNDEFINED" v-else>{{ $t('All podcasts') }}</option>
				<option value="YES">{{ $t('Authorized advertising') }}</option>
				<option value="NO">{{ $t('Prohibited advertising') }}</option>
			</select>
			<div class="saooti-arrow_down octopus-arrow-down-2 classic-select"></div>
		</label>
	</div>
</template>
<style lang="scss">
</style>
<script>

export default {

	props: ['isEmission'],

  data() {
    return {
      monetization: 'UNDEFINED'
    };
  },

  methods:{
    onChange(){
			this.$emit('updateMonetization', this.monetization);
		},
  }
};
</script>
