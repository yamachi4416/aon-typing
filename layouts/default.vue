<template>
  <div class="default-layout">
    <div class="background">
      <div class="background-image" />
    </div>
    <Nuxt />
  </div>
</template>

<style lang="scss" scoped>
.default-layout {
  .background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: -1;
    &-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: rgba(255, 255, 255, 1);
      background-repeat: repeat-x;
      background-size: auto 100%;
      background-position: top 0 left 50vw;
      background-image: url(~/static/img/back01.png);
      @media (max-height: 450px) {
        height: 500px;
      }
      @media (max-height: 650px) {
        height: 700px;
      }
    }
  }
}
</style>
