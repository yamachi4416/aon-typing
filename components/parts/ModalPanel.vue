<template>
  <div ref="modal" v-if="show" class="modal-panel hide">
    <div class="contents">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { wait } from "~~/libs/Util";

const pending = ref(false);
const show = ref(false);
const modal = ref<HTMLElement>();

defineExpose({
  get isOpen() {
    return show.value;
  },
  get isPending() {
    return pending.value;
  },
  async open(anim = true) {
    if (show.value || pending.value) return;
    pending.value = true;
    show.value = true;
    await nextTick();
    modal.value.classList.remove("hide");
    if (anim) {
      if (modal.value) {
        modal.value.classList.add("open");
        await wait(300);
        modal.value.classList.remove("open");
      }
    }
    pending.value = false;
  },
  async close(anim = true) {
    if (!show.value || pending.value) return;
    pending.value = true;
    if (anim && modal.value) {
      modal.value.classList.add("close");
      await wait(300);
      modal.value.classList.remove("close");
    }
    show.value = false;
    await nextTick();
    pending.value = false;
  },
});
</script>

<style lang="scss" scoped>
.modal-panel {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  padding: 10px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0);

  .contents {
    max-height: 100%;
    width: 100%;
    height: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &::after,
    &::before {
      content: " ";
      display: block;
      flex: 1;
      width: 100%;
    }
  }

  @keyframes modal {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(0);
    }
  }

  &.hide {
    display: none;
  }

  &.open {
    animation: modal 0.3s ease-in forwards;
  }

  &.close {
    animation: modal 0.3s ease-out reverse forwards;
  }
}
</style>
