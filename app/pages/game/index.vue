<template>
  <div />
</template>

<script setup lang="ts">
const navigator = useNavigator()
onMounted(async () => {
  await navigator.backOrGameMenu()
})
</script>
