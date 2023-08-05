<template>
  <div :class="$style.theme">
    <a href="#" @click.prevent="changeTheme('light')">light</a> /
    <a href="#" @click.prevent="changeTheme('dark')">dark</a>
  </div>
</template>

<script setup lang="ts">
const { changeTheme } = useTheme()
</script>

<style lang="scss" module>
.theme {
  a {
    color: var(--color-3);
    text-decoration: none;

    &:hover,
    &:focus {
      color: var(--color-9);
    }
  }

  @media print {
    display: none;
  }
}
</style>
