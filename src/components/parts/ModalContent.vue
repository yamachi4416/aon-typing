<template>
  <section class="modal-content" role="dialog" :aria-labelledby="titleId">
    <header>
      <h1 :id="titleId">{{ title }}</h1>
      <span>
        <div>
          <CloseCircle
            v-if="showClose"
            :title="`${title}ダイアログを閉じる`"
            @click="$emit('close')"
          />
        </div>
      </span>
    </header>
    <div ref="content">
      <slot name="default" />
    </div>
    <footer v-if="$slots.footer">
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
@use '~/assets/css/vars';
@use '~/assets/css/cmps';

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
    display: flex;
    justify-content: center;
    padding-top: 8px;
    padding-bottom: 2px;
    border-bottom: 1px solid var(--color-9);

    &::before {
      flex: 1;
      content: '';
    }

    h1 {
      padding-bottom: 3px;
      font-size: 1.17em;
      font-weight: normal;
      text-align: center;
    }

    span {
      flex: 1;
      min-width: 50px;

      & > * {
        position: absolute;
        top: 3px;
        right: 0;
        width: 35px;
        height: 35px;
      }
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
