<template>
  <div class="layout">
    <ImgPageBackground />
    <slot />
  </div>
</template>

<style lang="scss">
@import '~/assets/css/main';
</style>

<style lang="scss" scoped>
.layout {
  height: 100%;
  min-height: 100%;
}
</style>
