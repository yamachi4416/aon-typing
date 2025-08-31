<template>
  <h1>
    <NuxtLink to="/">
      {{ title }}
    </NuxtLink>
  </h1>
</template>

<script setup lang="ts">
import { toTypeJapaneseCharsMap } from '~~/libs/TypingUtil'
import { wait } from '~~/libs/Util'

const { name, anim = true } = defineProps<{
  name: string
  anim?: boolean
}>()

const fins = ref([name])
const bufs = ref<string[]>([])
const title = computed(() => [...fins.value, ...bufs.value].join(''))

onMounted(typing)

async function typing() {
  if (!anim) return

  const text = fins.value.join('')
  fins.value = []

  for (const { jc, ec } of toTypeJapaneseCharsMap(text)) {
    for (const c of ec) {
      bufs.value.push(c)
      await wait(100)
    }
    bufs.value = []
    fins.value.push(jc)
  }
}
</script>
