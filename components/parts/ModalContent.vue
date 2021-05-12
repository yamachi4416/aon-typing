<template>
  <section class="modal-content">
    <header>
      <h3 class="title" v-text="title" />
      <close-circle
        v-if="showClose"
        class="close-circle"
        @click="$emit('close')"
      />
    </header>
    <main>
      <slot name="default" />
    </main>
    <footer v-if="showFooter">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script>
import CloseCircle from './CloseCircle.vue'
export default {
  components: { CloseCircle },
  props: {
    title: {
      type: String,
      default: '',
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #fff;
  flex-direction: column;
  color: #333;
  border: 1px solid #999;
  border-radius: 10px;
  font-size: 1.2rem;
  max-width: calc(100vw - 20px);
  max-height: 100%;
  overflow-y: hidden;
  box-shadow: rgba(0, 0, 0, 0.15) 0 4px 6px 2px;
  padding: 0 5px;

  & > * {
    width: 100%;
    position: relative;
  }

  & > main {
    flex: 1;
    overflow-y: auto;
  }

  & > header {
    padding-top: 8px;
    padding-bottom: 2px;

    position: sticky;
    top: 0;
    background: #fff;
    z-index: 10;

    .title {
      padding-bottom: 3px;
      border-bottom: 1px solid #999;
      text-align: center;
      font-weight: normal;
    }

    .close-circle {
      right: 5px;
      top: -2.5px;
    }
  }

  & > footer {
    padding-top: 8px;
    padding-bottom: 8px;
    border-top: 1px solid #999;
  }
}
</style>
