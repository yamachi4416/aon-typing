<template>
  <section :aria-labelledby="titleId" class="modal-content" role="dialog">
    <header class="modal-content-header">
      <span class="modal-content-header-left" />
      <h1 :id="titleId" class="modal-content-header-title">{{ title }}</h1>
      <span class="modal-content-header-right">
        <div class="close-circle">
          <CloseCircle
            v-if="showClose"
            :title="`${title}ダイアログを閉じる`"
            @click="$emit('close')"
          />
        </div>
      </span>
    </header>
    <div ref="content" class="modal-content-main">
      <slot name="default" />
    </div>
    <footer v-if="$slots.footer" class="modal-content-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
import CloseCircle from '~/components/parts/CloseCircle.vue'

withDefaults(
  defineProps<{
    title: string
    showClose?: boolean
  }>(),
  {
    title: 'ダイアログ',
    showClose: true,
  },
)

defineEmits<{
  (e: 'close'): any
}>()

const content = ref<HTMLElement>()
const uid = getCurrentInstance()?.uid
const titleId = computed(() => `dialog-title-${uid}`)

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
  max-width: calc(100vw - 20px);
  max-height: 100%;
  padding: 0 5px;
  border: 2px solid var(--color-3);
  border-radius: 8px;
  box-shadow: var(--shadow-color-lg) 3px 3px 9px;

  :where(&) {
    width: 1000px;
    height: 100%;
    overflow-y: hidden;
    font-size: 1.1rem;
    color: var(--color-3);
    background: var(--color-f);
  }

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
    border-bottom: 1px solid var(--color-9);

    &-left {
      flex: 1;
    }

    &-title {
      padding-bottom: 3px;
      font-size: 1.17em;
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
    border-top: 1px solid var(--color-9);
  }
}
</style>
