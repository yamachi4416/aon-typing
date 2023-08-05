<template>
  <section
    :class="[$style.content, $props.panelClass]"
    role="dialog"
    :aria-labelledby="titleId"
  >
    <header>
      <h1 :id="titleId">{{ title }}</h1>
      <span>
        <CloseCircle
          v-if="showClose"
          :title="`${title}ダイアログを閉じる`"
          @click="$emit('close')"
        />
      </span>
    </header>
    <component :is="is" ref="content" v-bind="$attrs">
      <slot name="default" />
    </component>
    <footer v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script lang="ts">
import CloseCircle from '~/components/parts/CloseCircle.vue'

export default defineComponent({
  inheritAttrs: false,
})
</script>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    is?: string
    panelClass?: string
    showClose?: boolean
  }>(),
  {
    title: 'ダイアログ',
    is: 'div',
    panelClass: undefined,
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

<style lang="scss" module>
@use '~/assets/css/vars';
@use '~/assets/css/cmps';

.content {
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
  color: var(--color-3);
  background: var(--color-f);
  border: 2px solid var(--color-3);
  border-radius: 8px;
  box-shadow: var(--shadow-color-lg) 3px 3px 9px;

  & > header,
  & > div,
  & > footer {
    position: relative;
    width: 100%;
  }

  & > div {
    flex: 1;
    overflow-y: auto;

    @include vars.media_s {
      padding: 0 0 5px;
    }
  }

  & > header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: grid;
    grid-template-columns: 42px 1fr 42px;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--color-9);

    @include vars.media_s {
      grid-template-columns: 1fr 42px;
    }

    @include vars.media_ml {
      &::before {
        content: '';
      }
    }

    h1 {
      padding-top: 8px;
      padding-bottom: 5px;
      font-size: 1.17em;
      font-weight: normal;
      text-align: center;
    }

    span {
      display: flex;
      width: 100%;
      aspect-ratio: 1 / 1;
      padding: 3px 0 3px 6px;
    }
  }

  & > footer {
    @include cmps.buttons;

    width: 100%;
    padding-top: 8px;
    padding-bottom: 8px;
    border-top: 1px solid var(--color-9);
  }
}
</style>
