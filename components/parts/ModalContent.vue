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
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #fff;
  flex-direction: column;
  color: #333;
  border: 3px solid #333;
  border-radius: 5px;
  font-size: 1.2rem;
  max-width: calc(100vw - 20px);
  max-height: 100%;
  overflow-y: hidden;

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
      margin: 0;
      padding: 0;
      padding-bottom: 3px;
      border-bottom: 2px solid #333;
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
    border-top: 2px solid #333;
  }
}
</style>
