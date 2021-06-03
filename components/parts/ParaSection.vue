<template>
  <div class="para-section">
    <div v-if="$slots.left" class="para-section-left">
      <span class="fuki" />
      <slot class="para-section-left-slot" name="left" />
    </div>
    <section class="para-section-main">
      <slot />
    </section>
    <div v-if="$slots.right" class="para-section-right">
      <span class="fuki" />
      <slot class="para-section-right-slot" name="right" />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '~/assets/css/vars.scss';

.para-section {
  padding: 10px;
  position: relative;
  display: flex;
  z-index: 0;
  page-break-inside: avoid;

  &:hover {
    z-index: 1;
  }

  &-main {
    flex: 1;
    background: rgba(255, 255, 255, 0.9);
    padding: 20px;
    box-shadow: rgba(0, 0, 0, 0.15) 0 1px 3px 0;
    border-radius: 20px;
    position: relative;
    color: #444;

    h1,
    h2,
    h3 {
      color: #666;
    }
    p {
      padding: 10px;
      line-height: 1.8;
    }
  }

  &-right,
  &-left {
    display: flex;
    width: 20%;
    max-width: 150px;
    overflow: hidden;
    z-index: 2;
    flex-direction: column;

    & > * {
      width: 100%;
    }

    .fuki {
      flex: 1;
      display: block;
      overflow: hidden;
      position: relative;
      min-height: 45px;

      &::before {
        content: '';
        display: block;
        width: 30px;
        height: 30px;
        position: absolute;
        transform: rotate(60deg) skew(-20deg, -20deg) translateZ(-1px);
        box-shadow: rgba(0, 0, 0, 0.15) 1px 0px 1px 0;
        background: linear-gradient(
          -135deg,
          rgba(255, 255, 255, 0.9) 51%,
          transparent 51%
        );
        left: -20px;
        bottom: 0;
      }
    }

    & > img {
      z-index: 1;
      width: 100%;
      height: auto;
      min-width: 90px;
      min-height: 90px;
    }
  }

  &-left {
    transform: scale(-1, 1);
  }

  @include __media_s {
    padding: 5px 7px 5px 7px;
    &-right,
    &-left {
      display: none;
    }
  }
}
</style>
