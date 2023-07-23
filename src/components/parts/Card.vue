<template>
  <component :is="is" class="parts-card col-s-12 col-m-6 col-4">
    <PartsPaper v-bind="$attrs">
      <slot />
    </PartsPaper>
  </component>
</template>

<script lang="ts">
export default defineComponent({
  inheritAttrs: false,
})
</script>

<script setup lang="ts">
withDefaults(
  defineProps<{
    is: string
  }>(),
  {
    is: 'div',
  },
)
</script>

<style lang="scss" scoped>
@import '~/assets/css/vars';

.parts-card {
  position: relative;
  z-index: 0;
  display: flex;
  padding: 10px;
  page-break-inside: avoid;

  &:hover {
    z-index: 1;
  }

  @include __media_s {
    padding: 5px 7px;
  }
}
</style>
