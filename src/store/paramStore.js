import octopusApi from '@saooti/octopus-api';

var state = {
  generalParameters : {
  },
  filter : {
    organisationId : undefined,
  },
  podcastPage : {
  },
  podcastsPage : {
  },
  emissionsPage: {
  },
  emissionPage: {
  },
  intervenantPage: {
  },
  searchPage: {
  },
  player:{
  },
  footer:{
  },
  organisation : {
  },
  octopusApi : {
  },
  oAuthParam : {
  }
};

var initialize = function initialize(initObject){
  return new Promise((resolve, reject) => {
    if(initObject.generalParameters){
      let param = initObject.generalParameters;
      state.generalParameters.organisationId = (typeof param.organisationId !== "undefined") ? param.organisationId : 'ecbd98d9-79bd-4312-ad5e-fc7c1c4a191c';
      state.generalParameters.authenticated = (typeof param.authenticated !== "undefined") ? param.authenticated : true;
      state.generalParameters.isAdmin =(typeof param.isAdmin !== "undefined") ? param.isAdmin : true;
      state.generalParameters.ApiUri = (typeof param.ApiUri !== "undefined") ? param.ApiUri : 'https://api.staging.saooti.org/';
      state.generalParameters.isIE11 = (typeof param.isIE11 !== "undefined") ? param.isIE11 : false;
      state.generalParameters.podcastmaker =(typeof param.podcastmaker !== "undefined") ? param.podcastmaker : false;
      state.generalParameters.buttonPlus =(typeof param.buttonPlus !== "undefined") ? param.buttonPlus : true;
      state.generalParameters.allCategories =(typeof param.allCategories !== "undefined") ? param.allCategories : [];
    }
    if(initObject.podcastPage){
      let param = initObject.podcastPage;
      state.podcastPage.EditBox = (typeof param.EditBox !== "undefined") ? param.EditBox : false;
      state.podcastPage.SharePlayer = (typeof param.SharePlayer !== "undefined") ? param.SharePlayer : true;
      state.podcastPage.ShareButtons = (typeof param.ShareButtons !== "undefined") ? param.ShareButtons : true;
      state.podcastPage.ShareDistribution = (typeof param.ShareDistribution !== "undefined")? param.ShareDistribution : false;
      state.podcastPage.MiniplayerUri = (typeof param.MiniplayerUri !== "undefined") ? param.MiniplayerUri : 'https://player.staging.saooti.org/';
      state.podcastPage.ouestFranceStyle = (typeof param.ouestFranceStyle !== "undefined") ? param.ouestFranceStyle : false;
      state.podcastPage.tagList= (typeof param.tagList !== "undefined") ? param.tagList : false;
      state.podcastPage.downloadButton= (typeof param.downloadButton !== "undefined") ? param.downloadButton : false;
    }
    if(initObject.podcastsPage){
      let param = initObject.podcastsPage;
      state.podcastsPage.ProductorSearch = (typeof param.ProductorSearch !== "undefined") ? param.ProductorSearch : true;
      state.podcastsPage.MonetizableFilter = (typeof param.MonetizableFilter !== "undefined") ? param.MonetizableFilter : true;
      state.podcastsPage.podcastShadow = (typeof param.podcastShadow !== "undefined") ? param.podcastShadow : true;
      state.podcastsPage.podcastBorderBottom = (typeof param.podcastBorderBottom !== "undefined") ? param.podcastBorderBottom : false;
      state.podcastsPage.titlePage = (typeof param.titlePage !== "undefined") ? param.titlePage : undefined;
      state.podcastsPage.emissionChooser = (typeof param.emissionChooser !== "undefined") ? param.emissionChooser : false;
    }
    if(initObject.emissionsPage){
      let param = initObject.emissionsPage;
      state.emissionsPage.smallItems = (typeof param.smallItems !== "undefined") ? param.smallItems : false;
      state.emissionsPage.lightItems = (typeof param.lightItems !== "undefined") ? param.lightItems : false;
      state.emissionsPage.titlePage = (typeof param.titlePage !== "undefined") ? param.titlePage : undefined;
      state.emissionsPage.itemPlayer = (typeof param.itemPlayer !== "undefined") ? param.itemPlayer : false;
      state.emissionsPage.rubriquage = (typeof param.rubriquage !== "undefined") ? param.rubriquage : undefined;
      state.emissionsPage.mainRubrique = (typeof param.mainRubrique !== "undefined") ? param.mainRubrique : undefined;
      state.emissionsPage.buttonMore = (typeof param.buttonMore !== "undefined") ? param.buttonMore : false;
      state.emissionsPage.overflowScroll = (typeof param.overflowScroll !== "undefined") ? param.overflowScroll : false;
    }
    if(initObject.emissionPage){
      let param = initObject.emissionPage;
      state.emissionPage.ouestFranceStyle = (typeof param.ouestFranceStyle !== "undefined") ? param.ouestFranceStyle : false;
      state.emissionPage.rssButton = (typeof param.rssButton !== "undefined") ? param.rssButton : false;
    }
    if(initObject.intervenantPage){
      let param = initObject.intervenantPage;
      state.intervenantPage.lightStyle = (typeof param.lightStyle !== "undefined") ? param.lightStyle : false;
      state.intervenantPage.rssButton = (typeof param.rssButton !== "undefined") ? param.rssButton : false;
    }
    if(initObject.searchPage){
      let param = initObject.searchPage;
      state.searchPage.hideBar = (typeof param.hideBar !== "undefined") ? param.hideBar : false;
    }
    if(initObject.player){
      let param = initObject.player;
      state.player.image = (typeof param.image !== "undefined") ? param.image : true;
      state.player.emissionName = (typeof param.emissionName !== "undefined") ? param.emissionName : false;
      state.player.clock = (typeof param.clock !== "undefined") ? param.clock : false;
      state.player.barTop = (typeof param.barTop !== "undefined") ? param.barTop : false;
    }
    if(initObject.organisation){
      let param = initObject.organisation;
      state.organisation.imageUrl = (typeof param.imageUrl !== "undefined") ? param.imageUrl : '/img/emptypodcast.png';
      state.organisation.name = (typeof param.name !== "undefined") ? param.name : 'Saooti';
      state.organisation.userName = (typeof param.userName !== "undefined") ? param.userName : '';
    }
    if(initObject.footer){
      let param = initObject.footer;
      state.footer.contactLink = (typeof param.contactLink !== "undefined") ? param.contactLink : undefined;
    }
    if(initObject.octopusApi){
      let param = initObject.octopusApi;
      state.octopusApi.url = (typeof param.url !== "undefined") ? param.url : "http://api.staging.saooti.org/";
      state.octopusApi.oAuthParam = (typeof param.oAuthParam !== "undefined") ? param.oAuthParam : undefined;
      if(state.generalParameters.podcastmaker){
        state.octopusApi.organisationId = (typeof param.organisationId !== "undefined") ? param.organisationId : undefined;
      }
      let error = octopusApi.initialize(state.octopusApi);
      if(error){
        reject();
      } else if(state.generalParameters.allCategories.length === 0){
        octopusApi.fetchCategories({ lang: 'fr' }).then((data)=>{
          state.generalParameters.allCategories = data;
          resolve();
        });
      }else{
        resolve();
      }
    }else{
      reject();
    }
  });
};

export {
	initialize,
	state
}