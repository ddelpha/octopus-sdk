<template>
  <div>
    <div class="modal-content" v-bind:class="{ active: active }">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-title h5">{{ title }}</div>
          <button type="button" class="close input-no-outline" data-dismiss="modal" aria-label="Close" v-if="closable">
            <span aria-hidden="true" @click="closePopup">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p class="d-flex justify-content-between align-items-center">
            {{$t('Rss feed:')}}
            <span id="LINK">{{rss}}</span>
            <input type="button" :value="$t('Copy')" class="btn btn-primary" @click="onCopyLINK()" :aria-label="$t('Copy')" />
          </p>
          <RssParameters :rssLink="link" :paramRSS.sync='rss'  v-if="link !== ''"/>
        </div>
        <div class="modal-footer" v-if="validatetext">
          <button class="btn btn-primary" @click="onValid">
            {{ validatetext }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import RssParameters from '../../display/sharing/RssParameters.vue';
export default {
  name: 'ClipboardModal',

  components:{
    RssParameters
  },

  props: ['title', 'active', 'closable', 'validatetext','link'],

  created(){
    this.rss = this.link;
  },

  data() {
    return {
      rss: "",
    };
  },

  methods: {
    closePopup(event) {
      event.preventDefault();
      this.$emit('close');
    },

    onValid() {
      this.$emit('validate');
    },
    onCopyLINK() {
      navigator.clipboard.writeText(this.rss);
    }
  },
};
</script>
