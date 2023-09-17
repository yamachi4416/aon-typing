<template>
  <div :class="$style.background">
    <div />
  </div>
</template>

<style lang="scss" module>
.background {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100dvw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--page-background-color);

  & > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100vh;
    background-color: var(--page-background-image-color);
    background-image: var(--page-background-image);
    background-repeat: repeat-x;
    background-position: top 0 left 50dvw;
    background-size: auto 100%;

    @media (height <= 450px) {
      height: 500px;
    }

    @media (height <= 650px) {
      height: 700px;
    }
  }
}
</style>
