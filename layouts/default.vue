<template>
  <div class="default-layout">
    <div class="background" />
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
    z-index: -1;
    background-color: rgba(255, 255, 255, 1);
    background-repeat: repeat-x;
    background-size: auto 100vh;
    background-position: top 50% left 50vw;
    background-attachment: fixed;
    background-image: url(~/static/img/back01.png);
  }
}
</style>
