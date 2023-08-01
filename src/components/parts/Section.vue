<template>
  <div class="parts-section">
    <div v-if="$slots.left" class="left">
      <span class="fuki" />
      <slot class="left-slot" name="left" />
    </div>
    <component :is="is" class="content" v-bind="$attrs">
      <slot />
    </component>
    <div v-if="$slots.right" class="right">
      <span class="fuki" />
      <slot class="right-slot" name="right" />
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  inheritAttrs: false,
})
</script>

<script setup lang="ts">
withDefaults(
  defineProps<{
    is?: string
  }>(),
  {
    is: 'div',
  },
)
</script>

<style lang="scss" scoped>
@use '~/assets/css/vars';
@use '~/assets/css/cmps';

.parts-section {
  position: relative;
  z-index: 0;
  display: flex;
  padding: 10px;
  page-break-inside: avoid;

  &:hover {
    z-index: 1;
  }

  .content {
    @include cmps.paper;
  }

  .right,
  .left {
    z-index: 2;
    display: flex;
    flex-direction: column;
    width: 20%;
    max-width: 150px;
    overflow: hidden;

    & > * {
      width: 100%;
    }

    .fuki {
      position: relative;
      display: block;
      flex: 1;
      min-height: 45px;
      overflow: hidden;

      &::before {
        position: absolute;
        bottom: 0;
        left: -20px;
        display: block;
        width: 30px;
        height: 30px;
        content: '';
        background: linear-gradient(
          -135deg,
          var(--background-90) 51%,
          transparent 51%
        );
        box-shadow: var(--shadow-color-md) 1px 0 1px 0;
        transform: rotate(60deg) skew(-20deg, -20deg) translateZ(-1px);
      }
    }

    & :where(img) {
      z-index: 1;
      width: 100%;
      min-width: 90px;
      height: auto;
      min-height: 90px;
    }
  }

  .left {
    transform: scale(-1, 1);
  }

  @include vars.media_s {
    padding: 5px 7px;

    .right,
    .left {
      display: none;
    }
  }
}
</style>
