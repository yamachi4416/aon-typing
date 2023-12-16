<template>
  <kbd :class="$style.kbd" v-text="props.text" />
</template>
<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>
<style module>
.kbd {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 0;
  font-size: 20px;
  line-height: 1;
  text-align: center;
  white-space: pre;
  border-radius: 5px;
}
</style>
