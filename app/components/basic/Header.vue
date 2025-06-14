<template>
  <header :class="$style.header" role="banner">
    <section>
      <h1>
        <NuxtLink :to="{ name: 'index' }">
          <span v-if="startAnim">{{ title }}</span>
          <span v-show="!startAnim">{{ titleText }}</span>
        </NuxtLink>
      </h1>
      <BasicHeaderThemeChagne />
    </section>
    <BasicHeaderNavigation />
  </header>
</template>

<script setup lang="ts">
import { typeJapaneseCharsMap } from '~~/libs/TypingJapaneseChars'
import { wait } from '~~/libs/Util'

const props = withDefaults(
  defineProps<{
    anim?: boolean
  }>(),
  {
    anim: true,
  },
)

const site = useSiteConfig()
const titleText = site.name
const startAnim = ref(false)
const titleChars = ref<string[]>([])
const title = computed(() =>
  props.anim ? titleChars.value.join('') : titleText,
)

onMounted(() => typing(titleText))

async function typing(text: string) {
  if (!props.anim) return
  return new Promise((resolve) => {
    const types = typeJapaneseCharsMap(text, undefined, true).map((v) => ({
      jc: v.jc,
      ec: v.ec?.split(''),
    }))

    const fins: string[] = []
    const bufs: string[] = []
    const type = async () => {
      startAnim.value = true

      const val = types.shift()
      if (val && val.ec && val.jc) {
        if (val.ec.length > 1) {
          types.unshift(val)
        }

        const buf = val.ec.shift()
        if (buf) {
          bufs.push(buf)
        }

        titleChars.value = [...fins, ...bufs]
        if (val.ec.length === 0) {
          bufs.splice(0)
          fins.push(val.jc)
        }
        await wait(100)
        requestAnimationFrame(type)
      } else {
        titleChars.value = Array.from(text)
        await wait(300)
        requestAnimationFrame(resolve)
      }
    }

    requestAnimationFrame(type)
  })
}
</script>

<style lang="scss" module>
.header {
  position: sticky;
  top: 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  padding: 10px;
  background: var(--page-header-background);
  box-shadow: var(--shadow-color-md) 0 1px 3px 0;

  @media print {
    position: relative;
    height: unset;
    padding-top: 25px;
    background: var(--color-f);
  }

  & > * {
    width: 100%;
    max-width: 1000px;
    padding-right: 10px;
    padding-left: 10px;

    @media print {
      max-width: unset;
    }
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  & > section {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;

    h1 {
      display: flex;
      align-items: center;
      height: 100%;
      font-size: 1.5em;
      line-height: 1;
      color: var(--color-p);

      a {
        color: inherit;

        &:hover,
        &:focus {
          color: inherit;
        }
      }
    }
  }
}
</style>
