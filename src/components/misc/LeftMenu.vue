<template>
  <div class="left-menu-container" v-show="displayMenu">
    <div class="routes-container h5">
      <router-link @click.native="onMenuClick"
        class="text-dark font-weight-bold mb-3 show-phone"
        to="/main/pub/home"
        >{{ $t('Home') }}</router-link
      >
      <router-link @click.native="onMenuClick"
        class="text-dark font-weight-bold mb-3"
        to="/main/pub/podcasts"
        >{{ $t('Podcasts') }}</router-link
      >
      <router-link @click.native="onMenuClick"
        class="text-dark font-weight-bold mb-3"
        to="/main/pub/emissions"
        >{{ $t('Emissions') }}</router-link
      >
      <router-link @click.native="onMenuClick"
        v-if="!isPodcastmaker"
        class="text-dark font-weight-bold mb-3"
        to="/main/pub/productors"
        >{{ $t('Productors') }}</router-link
      >
      <router-link @click.native="onMenuClick"
        class="text-dark font-weight-bold mb-3"
        to="/main/pub/participants"
        >{{ $t('Speakers') }}</router-link
      >
      <hr class="divided-line show-phone" />
      <router-link @click.native="onMenuClick"
        class="text-dark font-weight-bold mb-3 show-phone"
        v-for="category in categories"
        v-bind:key="category.id"
        v-bind:to="'/main/pub/category/' + category.id"
      >
        {{ category.name }}</router-link
      >
    </div>
  </div>
</template>
<style lang="scss">
.left-menu-container {
  position: fixed;
  top: 3rem;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: #fff;
  width: 20%;
  padding: 2rem;

  .routes-container {
    display: flex;
    flex-direction: column;
        font-size: 0.9rem;
  }
}
/** PHONES*/
@media (max-width: 960px) {
  .left-menu-container {
    width: 75%;
    max-height: 80%;
    left: 0.5rem;
    top: 2.5rem;
    padding-left: 1rem;
    font-size: 0.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 0.2rem 1rem rgba(79, 83, 90, 0.3);

    .routes-container {
      overflow-y: scroll;
      height: 100%;
    }
  }
  .divided-line {
    margin: 0.5rem 0;
    border-top: 1px solid lightgray;
  }
}
@media (max-width: 450px) {
  .left-menu-container {
    width: 90%;
    font-size: 0.3rem;
  }
}
</style>
<script>
import {state} from "../../store/paramStore.js";

export default {
  name: 'LeftMenu',

  props: ["displayMenu"],

  methods: {
    onMenuClick() {
      this.$emit('update:displayMenu', false);
    },
  },

  computed: {
    categories(){
      return state.generalParameters.allCategories.filter(c => {
          if(this.isPodcastmaker){
            return c.podcastOrganisationCount;
          } else{
            return c.podcastCount;
          }
        });
    },
     isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },
  },
};
</script>
