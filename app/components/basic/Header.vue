<template>
  <header :class="$style.header" role="banner">
    <section>
      <h1>
        <NuxtLink :to="{ name: 'index' }">
          {{ chars.title }}
        </NuxtLink>
      </h1>
      <BasicHeaderThemeChagne />
    </section>
    <BasicHeaderNavigation />
  </header>
</template>

<script setup lang="ts">
import { toTypeJapaneseCharsMap } from '~~/libs/TypingUtil'
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
const chars = reactive({
  fins: [site.name] as string[],
  bufs: [] as string[],
  get title() {
    return [...chars.fins, ...chars.bufs].join('')
  },
})

onMounted(typing)

async function typing() {
  if (!props.anim) return

  const { title } = chars

  chars.fins = []

  const types = toTypeJapaneseCharsMap(title)

  for (const { jc, ec } of types) {
    for (const c of Array.from(ec)) {
      chars.bufs.push(c)
      await wait(100)
    }
    chars.bufs = []
    chars.fins.push(jc)
  }
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
