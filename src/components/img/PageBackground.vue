<template>
  <div class="background">
    <div class="background-image" />
  </div>
</template>

<style lang="scss" scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #057523;

  &-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgb(255 255 255 / 100%);
    background-image: url(/assets/img/back01.png);
    background-repeat: repeat-x;
    background-position: top 0 left 50vw;
    background-size: auto 100%;
    @media (max-height: 450px) {
      height: 500px;
    }
    @media (max-height: 650px) {
      height: 700px;
    }
  }
}
</style>
