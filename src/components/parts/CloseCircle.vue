<template>
  <button
    class="close-button"
    v-bind="$attrs"
    title="ダイアログを閉じる"
    @click.self="$emit('click')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      stroke="currentColor"
      viewBox="0 0 100 100"
    >
      <line
        x1="30"
        y1="30"
        x2="70"
        y2="70"
        stroke-width="8"
        stroke-linecap="round"
      />
      <line
        x1="30"
        y1="70"
        x2="70"
        y2="30"
        stroke-width="8"
        stroke-linecap="round"
      />
    </svg>
  </button>
</template>

<style lang="scss" scoped>
.close-button {
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: transparent;
  border: 2px solid var(--color-3);
  border-radius: 50%;

  line {
    color: var(--color-3);
  }
}
</style>
