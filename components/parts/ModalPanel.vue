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
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: rgba(255, 248, 237, 0.7);
  overflow: auto;
  padding: 10px;

  .contents {
    max-height: 100%;
    max-width: 100%;
    &::after {
      content: ' ';
      display: block;
      height: 10px;
      width: 100%;
    }
  }

  &-enter {
    background: rgba(255, 248, 237, 0);

    & > .contents {
      transform: translateY(-150%);
    }

    &-active {
      transition: background 0.5s;
      & > .contents {
        transition: transform 0.5s;
      }
    }
  }

  &-leave {
    &-active {
      transition: background 0.5s;
      & > .contents {
        transition: transform 0.5s;
      }
    }

    &-to {
      background: rgba(255, 248, 237, 0);
      & > .contents {
        transform: translateY(-200%);
      }
    }
  }
}
</style>
