<template>
  <div v-if="show" ref="modal" :class="[$style.modal, $style.hide]">
    <div :class="$style.contents">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { wait } from '~~/libs/Util'

const pending = ref(false)
const show = ref(false)
const modal = ref<HTMLElement>()
const prevActive = ref<HTMLElement>()
const styles = useCssModule()

defineExpose({
  get isOpen() {
    return show.value
  },
  get isPending() {
    return pending.value
  },
  async open(anim = true) {
    if (show.value || pending.value) return
    pending.value = true
    show.value = true
    if (document.activeElement instanceof HTMLElement) {
      prevActive.value = document.activeElement
    }
    await nextTick()
    modal.value?.classList.remove(styles.hide)
    if (anim) {
      if (modal.value) {
        modal.value.classList.add(styles.open)
        await wait(300)
        modal.value.classList.remove(styles.open)
      }
    }
    pending.value = false
  },
  async close(anim = true) {
    if (!show.value || pending.value) return
    pending.value = true
    if (anim && modal.value) {
      modal.value.classList.add(styles.close)
      await wait(300)
      modal.value.classList.remove(styles.close)
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
  },
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
  width: 100vw;
  height: 100%;
  padding: 10px;
  overflow: auto;
  background: transparent;

  @keyframes modal {
    0% {
      transform: translateY(-100%);
    }

    100% {
      transform: translateY(0);
    }
  }
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

.hide {
  display: none;
}

.open {
  animation: modal 0.3s ease-in forwards;
}

.close {
  animation: modal 0.3s ease-out reverse forwards;
}
</style>
