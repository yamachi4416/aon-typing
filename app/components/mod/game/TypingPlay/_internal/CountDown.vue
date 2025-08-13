<template>
  <PartsCountDown v-show="shown" :count />
</template>

<script setup lang="ts">
import { AbortManager } from '~~/libs/AbortManager'
import { countDown } from '~~/libs/Util'

const abortManager = AbortManager.create()
const count = ref<number>()
const shown = computed(() => count.value === undefined || count.value > 0)

async function start() {
  try {
    abortManager.abort()
    abortManager.reset()
    count.value = 3

    await countDown(count.value, (c) => (count.value = c), {
      abortManager,
    })

    return !abortManager.isAborted
  } finally {
    count.value = 0
  }
}

onBeforeUnmount(() => {
  abortManager.abort()
})

defineExpose({
  start,
})
</script>
