<template>
  <div class="p-3 list-episodes">
    <h2 v-if="name">{{ $t('All podcast button', { name: name }) }}</h2>
    <h2 v-else>{{ $t('All podcast emission button') }}</h2>
    <div class="d-flex align-items-center flex-wrap">
      <div class="d-flex align-items-center flex-grow categories-filter" v-if="categoryFilter">
        <CategoryChooser
          :defaultanswer="$t('No category filter')"
          @selected="onCategorySelected"
        />
      </div>
      <div class="d-flex position-relative small-flex-grow">
        <input :placeholder="$t('Search')" v-model="searchPattern" class="filter-search-input input-no-outline flex-grow" />
        <div class="saooti-search-bounty filter-list-search-icon search-icon-container"></div>
      </div>
    </div>
      <PodcastList
        :first="first"
        :size="size"
        :iabId="iabId"
        :query="query"
        :participantId="participantId"
        :emissionId="emissionId"
        :organisationId="productorId"
        :reload="reloadList"
      />
  </div>
</template>

<style lang="scss">

.categories-filter {
  .multiselect {
    width: 75%;
    @media (max-width: 600px) {
      width: 100%;
    }
  }
}
.list-episodes {
  padding: 2rem 0rem 1rem !important;
  h2 {
    margin-bottom: 0.5rem;
  }
}
.filter-list-search-icon {
  right: 1.6rem !important;
  font-weight: bold;
}
.small-flex-grow{
  flex-grow: 0.3;
}
</style>

<script>
// @ is an alias to /src
import CategoryChooser from '../categories/CategoryChooser.vue';
import PodcastList from './PodcastList.vue';

export default {
  components: {
    CategoryChooser,
    PodcastList,
  },

  created() {
    if (this.$route.query.first) {
      this.$data.first = this.$route.query.first;
    } else {
      this.$data.first = 0;
    }
    if (this.$route.query.size) {
      this.$data.size = this.$route.query.size;
    } else {
      this.$data.size = 12;
    }
  },

  props: [
    'participantId',
    'name',
    'emissionId',
    'categoryFilter',
    'productorId',
    'reload'
  ],

  data() {
    return {
      first: undefined,
      size: undefined,
      searchPattern: '',
      iabId: undefined,
      reloadList: false,
    };
  },

  computed: {
    query() {
      if (this.searchPattern.length >= 3) {
        return this.searchPattern;
      } else {
        return '';
      }
    },
  },

  methods: {
    onCategorySelected(category) {
      if (category && category.id) {
        this.iabId = category.id;
      } else {
        this.iabId = undefined;
      }
    },
  },

  watch:{
    reload(){
      this.reloadList = !this.reloadList;
    }
  }
};
</script>
