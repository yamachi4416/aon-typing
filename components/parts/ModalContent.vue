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
import CloseCircle from "~/components/parts/CloseCircle.vue";

withDefaults(
  defineProps<{
    showClose?: boolean;
  }>(),
  {
    showClose: true,
  }
);

defineEmits<{
  (e: "close");
}>();

const content = ref<HTMLElement>();

function scroll(options: ScrollToOptions) {
  content.value?.scroll(options);
}

defineExpose({
  scroll,
});
</script>

<style lang="scss" scoped>
@import "~/assets/css/vars.scss";

.modal-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  color: #333;
  border: 2px solid #333;
  border-radius: 8px;
  font-size: 1.1rem;
  width: 1000px;
  max-width: calc(100vw - 20px);
  max-height: 100%;
  overflow-y: hidden;
  padding: 0 5px;
  box-shadow: 3px 3px 9px rgba(0, 0, 0, 0.4);
  background: rgba(255, 255, 255, 1);
  height: 100%;

  &-header,
  &-main,
  &-footer {
    width: 100%;
    position: relative;
  }

  &-main {
    flex: 1;
    overflow-y: auto;
    @include __media_s {
      padding: 0 0 5px 0;
    }
  }

  &-header {
    padding-top: 8px;
    padding-bottom: 2px;

    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #999;

    &-left {
      flex: 1;
    }

    &-title {
      padding-bottom: 3px;
      text-align: center;
      font-weight: normal;
    }

    &-right {
      flex: 1;
      min-width: 50px;
      .close-circle {
        width: 35px;
        height: 35px;
        position: absolute;
        right: 0px;
        top: 3px;
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
