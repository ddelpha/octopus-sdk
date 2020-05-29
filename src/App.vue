<template>
  <div id="app">
    <TopBar v-bind:displayMenu.sync="displayMenu" />
    <LeftMenu v-bind:displayMenu.sync="displayMenu" />
    <CategoryList />
    <router-view />
    <Footer />
  </div>
</template>
<style lang="scss" src="@/assets/octopus-library.scss"></style>
<style lang="scss">
</style>

<script>
import TopBar from '@/components/misc/TopBar.vue';
import LeftMenu from '@/components/misc/LeftMenu.vue';
import Footer from '@/components/misc/Footer.vue';
import CategoryList from '@/components/display/categories/CategoryList.vue';
import octopusApi from "@saooti/octopus-api";
import {state} from "./store/paramStore.js";

export default {
  name: 'app',
  components: {
    TopBar,
    LeftMenu,
    CategoryList,
    Footer
  },
  created(){
    if (this.$route.query.productor) {
      octopusApi.fetchOrganisation(this.$route.query.productor)
      .then(data => {
          this.$store.commit('filterOrga', {orgaId: this.$route.query.productor, imgUrl: data.imageUrl});
      });
    }else if(state.generalParameters.authenticated){
      this.$store.commit('filterOrga', {orgaId: state.generalParameters.organisationId});
    }
  },

  data() {
    return {
      displayMenu: false,
    };
  },
}
</script>

