<template>
  <section class="modal-content">
    <header class="modal-content-header">
      <span class="modal-content-header-left" />
      <h3 class="modal-content-header-title">
        <slot name="title" />
      </h3>
      <span class="modal-content-header-right">
        <div class="close-circle">
          <CloseCircle v-if="showClose" @click="$emit('close')" />
        </div>
      </span>
    </header>
    <main ref="content" class="modal-content-main">
      <slot name="default" />
    </main>
    <footer v-if="$slots.footer" class="modal-content-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
import CloseCircle from '~/components/parts/CloseCircle.vue'

withDefaults(
  defineProps<{
    showClose?: boolean
  }>(),
  {
    showClose: true,
  },
)

defineEmits<{
  (e: 'close'): any
}>()

const content = ref<HTMLElement>()

function scroll(options: ScrollToOptions) {
  content.value?.scroll(options)
}

defineExpose({
  scroll,
})
</script>

<style lang="scss" scoped>
@import '~/assets/css/vars';

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 1000px;
  max-width: calc(100vw - 20px);
  height: 100%;
  max-height: 100%;
  padding: 0 5px;
  overflow-y: hidden;
  font-size: 1.1rem;
  color: #333;
  background: rgb(255 255 255 / 100%);
  border: 2px solid #333;
  border-radius: 8px;
  box-shadow: 3px 3px 9px rgb(0 0 0 / 40%);

  &-header,
  &-main,
  &-footer {
    position: relative;
    width: 100%;
  }

  &-main {
    flex: 1;
    overflow-y: auto;
    @include __media_s {
      padding: 0 0 5px;
    }
  }

  &-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    padding-top: 8px;
    padding-bottom: 2px;
    border-bottom: 1px solid #999;

    &-left {
      flex: 1;
    }

    &-title {
      padding-bottom: 3px;
      font-weight: normal;
      text-align: center;
    }

    &-right {
      flex: 1;
      min-width: 50px;

      .close-circle {
        position: absolute;
        top: 3px;
        right: 0;
        width: 35px;
        height: 35px;
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
