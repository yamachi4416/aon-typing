<template>
  <dialog
    v-if="show"
    ref="modal"
    aria-modal="true"
    :aria-label="title"
    :aria-disabled="inert"
    :class="$style.modal"
    :inert
  >
    <div :class="$style.contents">
      <slot :close />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { isFunction } from '~~/libs/Util'

defineProps<{
  title?: string
}>()

const inert = ref(false)
const pending = ref(false)
const show = ref(false)
const modal = useTemplateRef('modal')
const prevActive = shallowRef<HTMLElement>()

async function animate(forward = true) {
  const element = modal.value
  if (!element) return
  if (!isFunction(element.animate)) return
  const keyframes = [
    { transform: 'translateY(-100%)' },
    { transform: 'translateY(0)' },
  ]
  const animation = element.animate(
    forward ? keyframes : keyframes.toReversed(),
    {
      duration: 300,
      easing: 'ease-in',
    },
  )
  animation.play()
  await animation.finished
}

async function open(anim = true) {
  if (show.value || pending.value) return
  pending.value = true
  show.value = true
  await nextTick()
  if (document.activeElement instanceof HTMLElement) {
    prevActive.value = document.activeElement
  }
  if (anim) {
    await animate(true)
  }
  pending.value = false
}

async function close(anim = true) {
  if (!show.value || pending.value) return
  pending.value = true
  if (anim) {
    await animate(false)
  }

  show.value = false
  await nextTick()
  pending.value = false

  const prev = prevActive.value
  prevActive.value = undefined

  const focus = () => {
    if (prev && document.contains(prev)) {
      prev.focus()
    }
  }

  focus()

  return {
    focus,
  }
}

const exposes = {
  get isOpen() {
    return show.value
  },
  get isPending() {
    return pending.value
  },
  get inert() {
    return inert.value
  },
  set inert(value) {
    inert.value = value
  },
  open,
  close,
}

export type Modal = typeof exposes

defineExpose(exposes)
</script>

<style lang="scss" module>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100dvw;
  height: 100%;
  padding: 10px;
  overflow: auto;
  appearance: none;
  background: transparent;
  border: none;
}

.contents {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  height: 100%;
  max-height: 100%;

  &::after,
  &::before {
    display: block;
    flex: 1;
    width: 100%;
    content: ' ';
  }
}
</style>
