<template>
  <div class="background">
    <div class="background-image"></div>
  </div>
</template>

<style lang="scss" scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
  background-color: #057523;
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
    background-image: url(/assets/img/back01.png);
    @media (max-height: 450px) {
      height: 500px;
    }
    @media (max-height: 650px) {
      height: 700px;
    }
  }
}
</style>
