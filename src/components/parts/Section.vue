<template>
  <div class="parts-section">
    <div v-if="$slots.left" class="parts-section-left">
      <span class="fuki" />
      <slot class="parts-section-left-slot" name="left" />
    </div>
    <section class="parts-section-main">
      <slot />
    </section>
    <div v-if="$slots.right" class="parts-section-right">
      <span class="fuki" />
      <slot class="parts-section-right-slot" name="right" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/css/vars';

.parts-section {
  position: relative;
  z-index: 0;
  display: flex;
  padding: 10px;
  page-break-inside: avoid;

  &:hover {
    z-index: 1;
  }

  &-main {
    position: relative;
    flex: 1;
    padding: 20px;
    color: var(--color-3);
    background: var(--background-90);
    border-radius: 20px;
    box-shadow: var(--shadow-color-md) 0 1px 3px 0;

    :where(h1, h2, h3) {
      color: var(--color-6);
    }

    :where(p) {
      padding: 10px;
      line-height: 1.8;
    }
  }

  &-right,
  &-left {
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

  &-left {
    transform: scale(-1, 1);
  }

  @include __media_s {
    padding: 5px 7px;

    &-right,
    &-left {
      display: none;
    }
  }
}
</style>
