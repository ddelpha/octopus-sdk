 <template>
  <div class="module-box">
  <h3>{{$t('Distribute')}}</h3>
    <p class="sharing-distribution-container">{{$t('Rss feed:')}}
      <span class="primary-color">{{rss}}</span>
      <input type="button" :value="$t('Copy')" class="btn btn-primary" @click="onCopyRSSURL()" />
    </p>
    <div class="sharing-distribution-container">
      <router-link v-bind:to="'/main/priv/distribution/deezer/' + emissionId" class="text-dark">
        <span class="saooti-deezer"/>Deezer
      </router-link>
      <router-link v-bind:to="'/main/priv/distribution/apple/' + emissionId" class="text-dark">
        <span class="saooti-apple"/>Apple Podcast / iTunes
      </router-link>
      <router-link v-bind:to="'/main/priv/distribution/tuneIn/' + emissionId" class="text-dark">
        <span class="saooti-tunin"/>TuneIn
      </router-link>
      <router-link v-bind:to="'/main/priv/distribution/tootak/' + emissionId" class="text-dark">
        <span class="saooti-tootak"/>Tootak
      </router-link>
      <router-link v-bind:to="'/main/priv/distribution/radioline/' + emissionId" class="text-dark">
        <span class="saooti-radioline"/>Radioline
      </router-link>
      <router-link v-bind:to="'/main/priv/distribution/spotify/' + emissionId" class="text-dark">
        <span class="saooti-spotify"/>Spotify
      </router-link>
    </div>
    <Snackbar ref="snackbar" position="bottom-left"></Snackbar>
  </div>
</template>
<style lang="scss">
.sharing-distribution-container {
  border: 0.05rem solid #eee;
  border-radius: 0.3rem;
  padding: 0.4rem;
  margin: 0.2rem 1rem;
  display: flex;
  font-weight: 500;
  align-items: center;
  justify-content: space-between;
  a {
    display: flex;
    align-items: center;
  }
  span {
    font-size: 1.3em;
    margin: 0 0.3em 0 0;
    &.saooti-tunin {
      font-size: 2.5em;
    }
    &.saooti-radioline {
      font-size: 2em;
    }
  }
  @media (max-width: 960px) {
    flex-wrap: wrap;
  }
  @media (max-width: 500px) {
    .primary-color{
      display: none;
    }
  }
}
</style>
<script>
import octopusApi from "@saooti/octopus-api";
import Snackbar from '../../misc/Snackbar.vue';

export default {

  components:{
    Snackbar
  },

  mounted() {
    this.getEmissionDetails(this.emissionId);
    this.fetchRss();
  },

  props: ['emissionId'],

  data() {
    return {
      emission: undefined,
      error: false,
      rss: "",
    };
  },

  methods: {
    getEmissionDetails(emissionId) {
      octopusApi.fetchEmission(emissionId).then(data => {
        this.emission = data;
        this.loaded = true;
        if(this.emission.annotations){
          if(this.emission.annotations.RSS){
            this.rssEmission = true;
          }
          if(this.emission.annotations.exclusive){
            this.exclusive = this.emission.annotations.exclusive == 'true' ? true : false;
            this.exclusive = this.exclusive && (this.organisationId !== this.emission.orga.id);
          }
        }
      })
      .catch(()=> {
        this.error = true;
        this.loaded = true;
      });
    },
    fetchRss() {
      if (this.$props.emissionId && this.$props.emissionId > 0) {
        this.emissionPage=octopusApi.fetchEmissionPath(this.emissionId);
        this.rss = octopusApi.fetchRSS(this.emissionId);
      }
    },
    onCopyRSSURL() {
      navigator.clipboard.writeText(this.rss);
      this.$refs.snackbar.open(this.$t('Link in clipboard'));
    }
  },
};
</script>
