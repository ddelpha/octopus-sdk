<template>
  <div class="bg-dark">
    <div id="footer" class="d-flex p-3 secondary-bg border-top footer-display-phone">
        <div class="d-flex flex-grow align-items-center flex-column">
          <div class="d-flex flex-column">
            <router-link class="linkHover" to="/main/pub/home">{{ $t('Home') }}</router-link>
            <router-link class="linkHover" to="/main/pub/podcasts">{{$t('Podcasts')}}</router-link>
            <router-link class="linkHover" to="/main/pub/emissions">{{$t('Emissions')}}</router-link>
            <router-link class="linkHover" to="/main/pub/productors" v-if="!isPodcastmaker">{{$t('Productors')}}</router-link>
            <router-link class="linkHover" to="/main/pub/participants">{{$t('Speakers')}}</router-link>
          </div>
        </div>
        <hr class="divided-line show-phone" />
        <div class="d-flex flex-grow align-items-center flex-column" v-if="!isPodcastmaker">
          <div class="d-flex flex-column">
            <div class="text-dark">&copy; Saooti 2019</div>
            <router-link class="linkHover" to="/main/pub/contact">{{$t('Contact')}}</router-link>
            <router-link class="linkHover" to="/main/pub/cgu">{{$t('Term of use')}}</router-link>
            <router-link class="linkHover" to="/main/pub/libraries">{{$t('Used libraries')}}</router-link>
          </div>
        </div>
        <div class="d-flex flex-grow align-items-center flex-column" v-if="isPodcastmaker && isContactLink">
          <div class="d-flex flex-column">
            <a class="linkHover" id="footer-contact" :href='isContactLink' target="_blank">{{$t('Contact')}}</a>
          </div>
        </div>
    </div>
    <Player @hide="showBlackBorder"/>
  </div>
</template>
<style lang="scss">

#footer {
  font-size: 0.7rem;
  a, .text-dark{
    color: #888 !important;
  }
}
.border-round {
  border-radius: 0 0 2rem 2rem;
}
/** PHONES*/
@media (max-width: 960px) {
  .footer-display-phone{
    flex-direction: column;
    .align-items-center{
      align-items: flex-start !important;
    }
  }
  .container {
    font-size: 0.6rem;
    .pages {
      margin-right: 3rem;
    }
  }
}
</style>

<script>
import Player from './Player.vue';
import {state} from "../../store/paramStore.js";

export default {
  name: 'Footer',
  components: {
    Player,
  },

  computed:{
    isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },
    isBarTop(){
      return state.player.barTop;
    },
    isContactLink(){
      return state.footer.contactLink;
    },
  },

  methods: {
    showBlackBorder(hide){
      if(hide){
        document.getElementById('footer').classList.remove('border-round');
      } else if(!this.isBarTop){
        document.getElementById('footer').className += ' border-round';
      }
    }
  }
};
</script>
