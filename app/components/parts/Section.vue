<template>
  <div :class="$style.section">
    <div
      v-if="$slots.left"
      :class="$style.left"
    >
      <span :class="$style.fuki" />
      <slot name="left" />
    </div>
    <component
      :is="is"
      :class="$style.content"
      v-bind="$attrs"
    >
      <slot />
    </component>
    <div
      v-if="$slots.right"
      :class="$style.right"
    >
      <span :class="$style.fuki" />
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

withDefaults(
  defineProps<{
    is?: string
  }>(),
  {
    is: 'section',
  },
)
</script>

<style lang="scss" module>
@use '~/assets/css/vars';
@use '~/assets/css/cmps';

@mixin side {
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: 20%;
  max-width: 150px;
  overflow: hidden;
  @content;

  @include vars.media_s {
    display: none;
  }

  /* stylelint-disable-next-line nesting-selector-no-missing-scoping-root */
  & > * {
    width: 100%;
  }

  /* stylelint-disable-next-line nesting-selector-no-missing-scoping-root */
  & :where(img) {
    z-index: 1;
    width: 100%;
    min-width: 90px;
    height: auto;
    min-height: 90px;
  }
}

.section {
  position: relative;
  z-index: 0;
  display: flex;
  padding: 10px;
  break-inside: avoid;

  &:hover {
    z-index: 1;
  }

  @include vars.media_s {
    padding: 5px 7px;
  }
}

.content {
  @include cmps.paper;
}

.right {
  @include side;
}

.left {
  @include side {
    transform: scale(-1, 1);
  }
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
    background: linear-gradient(-135deg, var(--background-90) 51%, transparent 51%);
    box-shadow: var(--shadow-color-md) 1px 0 1px 0;
    transform: rotate(60deg) skew(-20deg, -20deg) translateZ(-1px);
  }
}
</style>
