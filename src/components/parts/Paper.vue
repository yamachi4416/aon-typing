<template>
  <div class="paper">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.paper {
  position: relative;
  flex: 1;
  flex-grow: 1;
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
</style>
