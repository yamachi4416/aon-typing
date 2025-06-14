<template>
  <div :class="$style.theme">
    <button @click.prevent="changeTheme('light')">light</button> /
    <button @click.prevent="changeTheme('dark')">dark</button>
  </div>
</template>

<script setup lang="ts">
const { changeTheme } = useTheme()
</script>

<style lang="scss" module>
.theme {
  button {
    font-size: inherit;
    color: var(--color-3);
    appearance: none;
    cursor: pointer;
    background: none;
    border: none;

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
