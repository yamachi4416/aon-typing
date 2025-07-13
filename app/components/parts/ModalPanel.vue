<template>
  <div v-if="show" ref="modal" :class="$style.modal">
    <div :class="$style.contents">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const pending = ref(false)
const show = ref(false)
const modal = ref<HTMLElement>()
const prevActive = ref<HTMLElement>()

async function animate(forward = true) {
  const element = modal.value
  if (!element) return
  const keyframes = [
    { transform: 'translateY(-100%)' },
    { transform: 'translateY(0)' },
  ]
  const animation = element.animate(
    forward ? keyframes : [...keyframes].reverse(),
    {
      duration: 300,
      easing: 'ease-in',
    },
  )
  animation.play()
  return await animation.finished
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

defineExpose({
  get isOpen() {
    return show.value
  },
  get isPending() {
    return pending.value
  },
  open,
  close,
})
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
  background: transparent;
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
