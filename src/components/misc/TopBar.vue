<template>
  <div class="top-bar-container position-sticky" v-bind:class="{ 'shadow-element': scrolled }" v-if="init">
    <div class="top-bar">
      <div class="hamburger-menu" v-on:click="onDisplayMenu(false)" :aria-label="$t('open left Menu')">
        <div class="saooti-burger-menu h3"></div>
      </div>
      <router-link 
      :to="{ name: 'home', query:{productor: $store.state.filter.organisationId}}">
        <div class="top-bar-logo m-3" v-on:click="onDisplayMenu(true)">
          <img src="/img/logo_octopus_final.svg" :alt="$t('Logo of main page')" v-if="!filterOrga || imgUrl === undefined" />
          <img :src="imgUrl" :alt="$t('Logo of main page')" v-else/>
        </div>
      </router-link>
      <OrganisationChooserLight
        width="auto"
        :defaultanswer="$t('No organisation filter')"
        @selected="onOrganisationSelected"
        :value='organisationId'
        :light='true'
        class="mr-2 hide-top-bar"
        :reset='reset'
        v-if="!isPodcastmaker"
        />
      <div class="d-flex align-items-center justify-content-center flex-grow">
        <router-link v-if="isLiveTab && !isPodcastmaker && filterOrga && filterOrgaLive"
        :to="{ name: 'lives', query:{productor: $store.state.filter.organisationId}}"
        class="linkHover p-3 text-dark font-weight-bold">{{ $t('Live') }}</router-link>
        <router-link 
        :to="{ name: 'podcasts', query:{productor: $store.state.filter.organisationId}}"
        class="linkHover p-3 text-dark font-weight-bold">{{ $t('Podcasts') }}</router-link>
        <router-link
        :to="{ name: 'emissions', query:{productor: $store.state.filter.organisationId}}"
        class="linkHover p-3 text-dark font-weight-bold">{{ $t('Emissions') }}</router-link>
        <router-link 
        :to="{ name: 'participants', query:{productor: $store.state.filter.organisationId}}"
        class="linkHover p-3 text-dark font-weight-bold">{{ $t('Speakers') }}</router-link>
        <router-link 
        :to="{ name: 'productors', query:{productor: $store.state.filter.organisationId}}"
        class="linkHover p-3 text-dark font-weight-bold" v-if="!isPodcastmaker && !filterOrga">{{ $t('Productors') }}</router-link>
      </div>
      <div class="d-flex flex-column">
        <div class="d-flex justify-content-end hostedBy hide-phone"><span>{{$t('Hosted by')}}</span><span class="ml-1 mr-1 primary-color">Saooti</span></div>
        <div class="d-flex align-items-center justify-content-end flex-no-wrap">
          <b-dropdown
            class="split-dropdown"
            split
            right
            split-variant="primary main-button-dropdown"
            variant="primary"
            @click="goToUrl('/main/priv/backoffice')"
            :text="$t('My space')"
            v-if="authenticated"
          >
            <b-dropdown-text>
              <router-link to="/main/priv/upload" v-if="authenticated && !isPodcastmaker" class="align-self-center w-100 mb-2">
                <button class="btn btn-primary w-100">{{ $t('Upload') }}</button>
              </router-link>
              <template @click="displayMenuPhone(true)">
                <b-dropdown-item to="/main/priv/backoffice" class="linkSpace" v-if="!isPodcastmaker">{{ $t('My space') }}</b-dropdown-item>
                <b-dropdown-item to="/main/priv/edit/profile" v-if="!isPodcastmaker">{{ $t('Edit my profile') }}</b-dropdown-item>
                <b-dropdown-item to="/main/priv/edit/organisation" v-if="!isPodcastmaker">{{$t('Edit my organisation')}}</b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-header>{{$t('Help')}}</b-dropdown-header>
                <b-dropdown-item href="https://help.octopus.saooti.com/" target="_blank">{{ $t('TutoMag') }}</b-dropdown-item>
                <!-- <b-dropdown-item >{{ $t('News') }}</b-dropdown-item>
                <b-dropdown-item >{{ $t('Known issues') }}</b-dropdown-item> -->
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item href="/sso/logout">{{ $t('Logout') }}</b-dropdown-item>
              </template>
            </b-dropdown-text>
          </b-dropdown>
          <b-dropdown right toggle-class="text-decoration-none  m-1 admin-button btn-rounded-icon" no-caret v-else>
            <template v-slot:button-content>
              <i class="saooti-user-octopus text-dark"></i><span class="sr-only">Profile</span>
            </template>
              <b-dropdown-item href="/sso/login">{{ $t('Login') }}</b-dropdown-item>
              <b-dropdown-item to="/main/pub/create" v-if="!isPodcastmaker">{{$t('Create an account')}}</b-dropdown-item>
          </b-dropdown>
          <router-link 
          :aria-label ="$t('Search')"
          :to="{ name: 'podcasts', query:{productor: $store.state.filter.organisationId}}">
            <div class="btn admin-button m-1">
              <i class="saooti-search text-dark"></i>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.top-bar-container {
  top: 0;
  background: #fff;
  width: 100%;
  z-index: 10;
  padding: 0 2em;

  @media (max-width: 400px) {
    padding: 0 0.5rem;
  }

  .top-bar {
    transition: height 1s;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
    position: relative;

    .main-button-dropdown {
          padding-bottom: 0.4rem;
    }

    .top-bar-logo{
      margin: 1rem 2rem 1rem 1rem !important;
      img{
        max-width: 160px !important;
        max-height: 80px;
        height: 80px;
        border-radius: 0.8rem;
      }
    }
    .multiselect__tags {
      padding: 6px 40px 0 10px;
    }

    .btn-group .dropdown-toggle-split {
      background: #389452;
      align-items: center;
    }
   
    .hamburger-menu {
      display: none;
      margin: 0 1rem;
      @media (max-width: 600px) {
        margin: 0;
      }
      .saooti-burger-menu {
        font-size: 2.2em;
        font-weight: bold;
        margin-bottom: 0;
      }
      cursor: pointer;
    }
  }

  &.shadow-element {
    .linkHover{
      display: none;
    }
    .top-bar {
      height: 3.5rem;

      .hamburger-menu {
        display: block;
        .saooti-burger-menu {
          font-size: 2.2em;
          font-weight: bold;
          margin: 0;
        }
      }
      .top-bar-logo {
        flex-grow: 1;
        text-align: center;
        align-items: center;
        display: flex;
        img {
          height: 2rem;
          width: auto;
        }
      }
      .hostedBy{
        display: none !important;
      }
    }
  }
  .b-dropdown-text{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .dropdown-header{
    display: flex;
    align-items: center;
  }
  .hostedBy{
    font-size: 0.6rem;
    position: absolute;
    top: 5px;
    right: 0;
  }
  .dropdown-header{
    font-weight: bold;
  }
  .linkSpace{
    display: none;
  }
  
  /** PHONES*/
  @media (max-width: 1200px) {
    .hide-top-bar {
      display: none !important;
    }
    .linkSpace{
      display: block;
    }
    .hostedBy{
      display: none !important;
    }
    .top-bar {
      padding: 0;
      height: 3.5rem;
      .linkHover{
        display: none;
      }
      .hamburger-menu {
        flex-grow: 1;
        display: block;
      }
      .top-bar-logo {
        flex-grow: 1;
        text-align: center;
        display: flex;
        width: 100px;
        img {
          max-width: 100px !important;
        }
      }
    }
  }
  @media (max-width: 650px) {
    .dropdown{
      .main-button-dropdown{
        display: none;
      }
    }
    .btn-group .dropdown-toggle-split {
        height: 30px;
        width: 30px;
        border-radius: 50% !important;
      }
    .top-bar {
      .top-bar-logo {
        img {
          height: 2rem;
        }
      }
    }
  }
}
</style>

<script>
import {state} from "../../store/paramStore.js";
import OrganisationChooserLight from '../display/organisation/OrganisationChooserLight.vue';
import octopusApi from "@saooti/octopus-api";

export default {
  name: "TopBar",

  components:{
    OrganisationChooserLight
  },

  mounted() {
    if(this.filterOrga){
      this.organisationId = this.filterOrga;
    }
    this.init=true;
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  props: ["displayMenu"],

  data() {
    return {
      scrolled: false,
      oldScrollY: 0,
      minScroll: 0,
      organisationId:undefined,
      reset: false,
      init: false,
    };
  },

  computed: {
    isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },
    isLiveTab(){
      return state.generalParameters.isLiveTab;
    },
    authenticated(){
      return this.$store.state.authentication.isAuthenticated;
    },
    name(){
      return state.organisation.userName;
    },
    filterOrga(){
      return this.$store.state.filter.organisationId;
    },
    filterOrgaLive(){
      return this.$store.state.filter.live;
    },
    imgUrl(){
      if(this.$store.state.filter.imgUrl && !this.$store.state.filter.imgUrl.includes('emptypodcast')){
        return this.$store.state.filter.imgUrl;
      }else{
        return undefined;
      }
    }
  },

  methods: {
    handleScroll() {
      if (window.scrollY - this.oldScrollY > 0 && window.scrollY > 1 && document.body.offsetHeight - window.innerHeight > 40) {
        this.scrolled = true;
        this.minScroll = 0;
      } else if (
        window.scrollY - this.oldScrollY < 0 &&
        window.scrollY < 1 &&
        this.minScroll > 20
      ) {
        this.scrolled = false;
        this.minScroll = 0;
      }
      this.oldScrollY = window.scrollY;
      if (this.minScroll < window.scrollY) {
        this.minScroll = window.scrollY;
      }
      if (!this.scrolled) {
        this.$emit('update:displayMenu', false);
      }
    },

    onDisplayMenu(param) {
      if(param === true){
        this.$emit('update:displayMenu', false);
      } else{
        this.$emit('update:displayMenu', !this.displayMenu);
      }
    },

    displayMenuPhone(hidden) {
      if (hidden) {
        this.$refs.menu.className = "menu hid";
      } else {
        this.$refs.menu.className = "menu";
      }
    },

    async onOrganisationSelected(organisation){
      if (organisation && organisation.id) {
        if(this.$route.query.productor !== organisation.id){
          this.$router.push({query: {productor: organisation.id}});
        }
        this.$store.commit('filterOrga', {orgaId: organisation.id, imgUrl: organisation.imageUrl});
        const isLive = await octopusApi.liveEnabledOrganisation(organisation.id);
        this.$store.commit('filterOrgaLive', isLive);
      } else {
        this.organisationId = undefined;
        if(this.$route.query.productor){
          this.$router.push({query: {productor: undefined}});
        }
        this.$store.commit('filterOrga', {orgaId: undefined});
      }
    },
    goToUrl(url){
      if(this.authenticated){
        this.$router.push(url);
      }
    }
  },

  watch:{
    filterOrga(newVal){
      if(newVal){
        this.organisationId = newVal;
      }else{
        this.reset = !this.reset;
      }
    }
  }
};
</script>
