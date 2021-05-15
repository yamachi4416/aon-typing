<template>
  <span class="cancel">
    <button class="cancel-button" @click="$emit('click')"></button>
  </span>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.cancel {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 45px;

  &-button {
    position: relative;
    width: 35px;
    height: 35px;
    border: 2px solid #333;
    background: transparent;
    border-radius: 50%;
    cursor: pointer;

    &::before,
    &::after {
      content: '';
      display: block;
      width: calc(100% - 9px);
      height: 4px;
      background: #333;
      transform-origin: 50% 50%;
      position: absolute;
      top: calc(50% - 1.5px);
      left: 4.5px;
      border-radius: 5px;
    }
    &::before {
      transform: rotate(-45deg);
    }
    &::after {
      transform: rotate(45deg);
    }
  }
}
</style>
