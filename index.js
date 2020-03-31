//Pages
import Podcast from "./src/components/pages/Podcast.vue";
import Podcasts from "./src/components/pages/Podcasts.vue";
import Emission from "./src/components/pages/Emission.vue";
import Emissions from "./src/components/pages/Emissions.vue";
import Participant from "./src/components/pages/Participant.vue";
import Participants from "./src/components/pages/Participants.vue";
import Search from "./src/components/pages/Search.vue";
import Home from "./src/components/pages/Home.vue";
import Category from "./src/components/pages/Category.vue";
//Misc
import Footer from "./src/components/misc/Footer.vue";
import LeftMenu from "./src/components/misc/LeftMenu.vue";
import Player from "./src/components/misc/Player.vue";
import Snackbar from "./src/components/misc/Snackbar.vue";
import TopBar from "./src/components/misc/TopBar.vue";
//Display
import CategoryChooser from "./src/components/display/categories/CategoryChooser.vue";
import CategoryList from "./src/components/display/categories/CategoryList.vue";
/*import EditBox from "./src/components/display/edit/EditBox.vue"; */
import EmissionChooser from "./src/components/display/emission/EmissionChooser.vue";
/* import EmissionItem from "./src/components/display/emission/EmissionItem.vue"; */
/*import EmissionList from "./src/components/display/emission/EmissionList.vue";
import MonetizableFilter from "./src/components/display/filter/MonetizableFilter.vue";
import ProductorSearch from "./src/components/display/filter/ProductorSearch.vue";*/
import OrganisationChooser from "./src/components/display/organisation/OrganisationChooser.vue";
/*import ParticipantItem from "./src/components/display/participant/ParticipantItem.vue";
import ParticipantList from "./src/components/display/participant/ParticipantList.vue";
import AnimatorsItem from "./src/components/display/podcasts/AnimatorsItem.vue";*/
import PodcastFilterList from "./src/components/display/podcasts/PodcastFilterList.vue";
/*import PodcastImage from "./src/components/display/podcasts/PodcastImage.vue";*/
import PodcastInlineList from "./src/components/display/podcasts/PodcastInlineList.vue";
/*import PodcastItem from "./src/components/display/podcasts/PodcastItem.vue";*/
import PodcastList from "./src/components/display/podcasts/PodcastList.vue";
import ShareButtons from "./src/components/display/sharing/ShareButtons.vue";
/*import ShareDistribution from "./src/components/display/sharing/ShareDistribution.vue";
import SharePlayer from "./src/components/display/sharing/SharePlayer.vue"; */
import EmissionInlineList from "./src/components/display/emission/EmissionInlineList.vue";

const components = {
    Podcast,
    Podcasts,
    Emission,
    Emissions,
    Participant,
    Participants,
    Search,
    Home,
    Category,
    Footer,
    LeftMenu,
    Player,
    TopBar,
    CategoryChooser,
    CategoryList,
    PodcastInlineList,
    EmissionChooser,
    /* EmissionItem, */
    OrganisationChooser,
    PodcastFilterList,
    ShareButtons,
    PodcastList,
    EmissionInlineList,
    Snackbar
}

export default components;

export {
    Podcast,
    Podcasts,
    Emission,
    Emissions,
    Participant,
    Participants,
    Search,
    Home,
    Category,
    Footer,
    LeftMenu,
    Player,
    TopBar,
    CategoryChooser,
    CategoryList,
    PodcastInlineList,
    EmissionChooser,
    /* EmissionItem, */
    OrganisationChooser,
    PodcastFilterList,
    ShareButtons,
    PodcastList,
    EmissionInlineList,
    Snackbar
};