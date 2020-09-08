 <template>
    <b-card no-body class="mr-3 ml-3 rss-parameters">
      <b-card-header header-tag="header" role="tab">
        <b-button block v-b-toggle.accordion variant="info">{{$t('Rss feed parameters')}}</b-button>
      </b-card-header>
      <b-collapse id="accordion" role="tabpanel">
        <b-card-body>
          <b-card-text>
            <div class="d-flex align-items-center mb-2">
              <div class="checkbox-saooti">  
                <input type="checkbox" class="custom-control-input" id="episodeBeforeCheck" v-model="episodeBefore">  
                <label class="custom-control-label sentence" for="episodeBeforeCheck">{{$t('Not share episodes before')}}</label>  
              </div>
              <input type="number" min="1" class="input-share-player input-no-outline text-center ml-1" v-model="numberEpisodeBefore"/>
              <b-form-radio v-model="typeEpisodeBefore" name="typeEpisodeBefore" value="d">{{$t('days')}}</b-form-radio>
              <b-form-radio v-model="typeEpisodeBefore" name="typeEpisodeBefore" value="h">{{$t('hours')}}</b-form-radio>
            </div>
            <div class="d-flex align-items-center">
              <div class="checkbox-saooti">  
                <input type="checkbox" class="custom-control-input" id="episodeAfterCheck" v-model="episodeAfter">  
                <label class="custom-control-label sentence" for="episodeAfterCheck">{{$t('Not share episodes after')}}</label>  
              </div>
              <input type="number" min="1" class="input-share-player input-no-outline text-center ml-1" v-model="numberEpisodeAfter"/>
              <b-form-radio v-model="typeEpisodeAfter" name="typeEpisodeAfter" value="d">{{$t('days')}}</b-form-radio>
              <b-form-radio v-model="typeEpisodeAfter" name="typeEpisodeAfter" value="h">{{$t('hours')}}</b-form-radio>
            </div>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
</template>
<style lang="scss">
.rss-parameters.card{
	border: 0;
	.btn {
		border-radius: 0;
	}
  .card-header {
    border: 0;
    background-color: #fafafa;
    padding :0;
  }
  .card-body {
    border: 0.05rem solid #eee;
    background-color: #fafafa;
  }
  input[type=number]{
    width: 90px;
  }
  .custom-control-label.sentence{
    width: 415px;
    @media (max-width: 960px) {
      width: auto;
    }
  }
}

</style>
<script>

export default {
  props: ['rssLink', 'paramRSS'],

  data() {
    return {
      episodeBefore: false,
      episodeAfter: false,
      numberEpisodeBefore: 1,
      numberEpisodeAfter: 1,
      typeEpisodeBefore:'d',
      typeEpisodeAfter: 'd',
    };
  },
  computed:{
    rss(){
        let rss = this.rssLink;
        if(this.episodeBefore || this.episodeAfter){
          rss += '?';
          if(this.episodeBefore){
            rss += 'minAge=';
            if(this.numberEpisodeBefore<=1){
              rss += '1';
            }else{
              rss += this.numberEpisodeBefore;
            }
            if(this.typeEpisodeBefore === 'h'){
              rss += 'h';
            }
            if(this.episodeAfter){
              rss += '&'
            }
          }
          if(this.episodeAfter){
            rss += 'maxAge=';
            if(this.numberEpisodeAfter<=1){
              rss += '1';
            }else{
              rss += this.numberEpisodeAfter;
            }
            if(this.typeEpisodeAfter === 'h'){
              rss += 'h';
            }
          }
        }
        return rss;
    }
  },

  watch:{
    rss(){
			this.$emit('update:paramRSS', this.rss);
    }
  }

};
</script>
