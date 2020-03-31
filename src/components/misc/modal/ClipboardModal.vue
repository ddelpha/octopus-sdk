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
          <p class="d-flex justify-content-between">
            {{$t('Rss feed:')}}
            <span id="LINK">{{link}}</span>
            <input type="button" value="Copier" class="btn btn-primary" @click="onCopyLINK()" />
          </p>
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
export default {
  name: 'ClipboardModal',

  props: ['title', 'active', 'closable', 'validatetext','link'],

  methods: {
    closePopup(event) {
      event.preventDefault();
      this.$emit('close');
    },

    onValid() {
      this.$emit('validate');
    },
    onCopyLINK() {
      navigator.clipboard.writeText(this.link);
    }
  },
};
</script>
