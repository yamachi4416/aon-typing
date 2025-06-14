<template>
  <div :class="$style.layout">
    <ImgPageBackground />
    <slot />
  </div>
</template>

<style lang="scss" module>
.layout {
  height: 100%;
  min-height: 100%;
}
</style>
