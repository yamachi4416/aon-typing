<template>
  <section class="modal-content">
    <header class="modal-content-header">
      <span class="modal-content-header-left" />
      <h3 class="modal-content-header-title" v-text="title" />
      <span class="modal-content-header-right">
        <close-circle
          v-if="showClose"
          class="close-circle"
          @click="$emit('close')"
        />
      </span>
    </header>
    <main class="modal-content-main">
      <slot name="default" />
    </main>
    <footer v-if="showFooter" class="modal-content-footer">
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
@import '~/assets/css/vars.scss';

.modal-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  color: #333;
  border: 2px solid #333;
  border-radius: 8px;
  font-size: 1.1rem;
  max-width: calc(100vw - 20px);
  max-height: 100%;
  overflow-y: hidden;
  padding: 0 5px;
  box-shadow: 3px 3px 9px rgba(0, 0, 0, 0.4);
  background: rgba(255, 255, 255, 1);

  &-header,
  &-main,
  &-footer {
    width: 100%;
    position: relative;
  }

  &-main {
    flex: 1;
    overflow-y: auto;
    @include __media_s {
      padding: 5px 0;
    }
  }

  &-header {
    padding-top: 8px;
    padding-bottom: 2px;

    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #999;

    &-left {
      flex: 1;
    }

    &-title {
      padding-bottom: 3px;
      text-align: center;
      font-weight: normal;
    }

    &-right {
      flex: 1;
      min-width: 50px;
      .close-circle {
        right: 5px;
      }
    }
  }

  &-footer {
    padding-top: 8px;
    padding-bottom: 8px;
    border-top: 1px solid #999;
  }
}
</style>
