import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from './App.vue'
import VueI18n from 'vue-i18n';
import I18nResources from './locale/messages';
import router from '@/router/router';
import moment from 'moment';
import store from '@/store/AppStore';
let paramStore = require('./store/paramStore');


moment.locale('fr');
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false;

//Gestion de l'i18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'fr',
  messages: I18nResources,
});

// Initialisation store
paramStore.initialize({
  generalParameters : {},
  podcastPage : {},
  podcastsPage : {},
  emissionsPage : {},
  emissionPage: {},
  intervenantPage: {},
  searchPage: {},
  player:{},
  organisation : {},
  octopusApi : {},
  footer:{},
}).then(()=>{
  new Vue({
    i18n,
    store,
    router,
    render: h => h(App),
  }).$mount('#app')
  Vue.seleniumFormat = function(string){
    return string.toLowerCase().replace(/\s/g, "");
  };
});

