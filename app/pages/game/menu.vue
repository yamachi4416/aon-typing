<template>
  <ModGameTypingMenu
    @start="navigator.gamePlay"
    @cancel="navigator.backOrIndex"
  />
</template>

<script setup lang="ts">
const navigator = useNavigator()

useHead({
  title: 'タイピングメニュー',
})
</script>
