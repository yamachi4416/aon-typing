<template>
  <transition name="modal-panel">
    <div v-if="show" class="modal-panel">
      <div class="contents">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-panel {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
      content: ' ';
      display: block;
      flex: 1;
      width: 100%;
    }
  }

  &-enter {
    transform: translateY(-120%);

    &-active {
      transition: transform 0.5s;
    }
  }

  &-leave {
    &-active {
      transition: transform 0.5s;
    }

    &-to {
      transform: translateY(-120%);
    }
  }
}
</style>
