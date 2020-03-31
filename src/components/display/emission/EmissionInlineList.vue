<template>
  <div class="d-flex flex-column p-3 list-episode">
    <div class="d-flex justify-content-end">
      <div class="hide-phone">
        <button class="btn btn-arrow" @click="displayPrevious()" :class="{ disabled: !previousAvailable }">
          <div class="saooti-arrow-left2"></div>
        </button>
        <button class="btn btn-arrow" @click="displayNext()" :class="{ disabled: !nextAvailable }">
          <div class="saooti-arrow-right2"></div>
        </button>
      </div>
    </div>
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border mr-3"></div>
      <h3 class="mt-2">{{ $t('Loading emissions ...') }}</h3>
    </div>
    <transition-group :name="transitionName" class="podcast-list-inline" tag="ul" v-show="loaded">
      <EmissionPlayerItem class="flex-shrink item-phone-margin" :emission='e'  v-for="e in emissions" v-bind:key="e.emissionId" />
    </transition-group>
    <router-link v-bind:to="href" class="btn btn-link">{{buttonText}}</router-link>
  </div>
</template>

<style lang="scss">
</style>

<script>
import octopusApi from "@saooti/octopus-api";
import domHelper from "../../../helper/dom";
import EmissionPlayerItem from "./EmissionPlayerItem.vue";

const PHONE_WIDTH = 960;

export default {
  name: "EmissionInlineList",

  props: [
    "organisationId",
    "href",
    "buttonText",
  ],

  components: {
    EmissionPlayerItem
  },

  created() {
    window.addEventListener("resize", this.handleResize);
  },

  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },

  mounted() {
    this.handleResize();
    this.fetchNext();
  },

  data() {
    return {
      loading: true,
      loaded: true,
      index: 0,
      first: 0,
      size: 5,
      totalCount: 0,
      popularSort: true,
      allEmissions: [],
      direction: 1
    };
  },

  computed: {
    emissions() {
      return this.allEmissions.slice(this.index, this.index + this.size);
    },

    previousAvailable() {
      return this.index > 0;
    },
    nextAvailable() {
      return this.index + this.size < this.totalCount;
    },
    transitionName: ({ direction }) =>
      direction > 0 ? "out-left" : "out-right"
  },

  methods: {
    fetchNext() {
      octopusApi
        .fetchEmissions({
          first: this.first,
          size: this.size + 1,
          organisationId: this.organisationId,
        })
        .then(data => {
          this.loading = false;
          this.loaded = true;
          this.totalCount = data.count;
          if (this.allEmissions.length + data.result.length < this.totalCount) {
            let nexEl = data.result.pop();
            this.preloadImage(nexEl.imageUrl);
          }
          this.allEmissions = this.allEmissions.concat(data.result);
          this.first += this.size;
        });
    },

    displayPrevious() {
      this.direction = -1;
      if (this.previousAvailable) {
        this.index -= 1;
      }
    },

    displayNext() {
      this.direction = 1;
      if (this.nextAvailable) {
        if (
          this.first - (this.index + this.size) < 2 &&
          this.allEmissions.length < this.totalCount
        ) {
          this.fetchNext();
        }
        this.index += 1;
      }
    },

    handleResize() {
      if (this.$el) {
        if (window.innerWidth <= PHONE_WIDTH) {
          this.size = 10;
        } else {
          const width = this.$el.offsetWidth;
          const sixteen = domHelper.convertRemToPixels(13.7);
          this.size = Math.floor(width / sixteen);
        }
      }
    },


    reset() {
      this.loading = true;
      this.loaded = true;
      this.index = 0;
      this.first = 0;
      this.totalCount = 0;
      this.allEmissions = [];
    },

    preloadImage(url) {
      let img = new Image();
      img.src = url;
    }
  },
};
</script>
