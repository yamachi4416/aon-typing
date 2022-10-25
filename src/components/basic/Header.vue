<template>
  <header class="basic-header">
    <nav class="basic-header-nav">
      <div class="basic-header-nav-main">
        <h1>
          <NuxtLink :to="{ name: 'index' }">
            <span v-if="startAnim" class="title-anim">{{ title }}</span>
            <span v-show="!startAnim" class="title-no-anim">{{
              titleText
            }}</span>
          </NuxtLink>
        </h1>
      </div>
      <div class="basic-header-nav-sub">
        <nav class="basic-header-nav-sub-menu">
          <ul>
            <li v-for="(menu, i) in menus" :key="`menu-${i}`">
              <NuxtLink :to="menu.route">
                {{ menu.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </nav>
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

const titleText = 'あぉ～ん タイピング'
const startAnim = ref(false)
const titleChars = ref([] as string[])
const title = computed(() =>
  props.anim ? titleChars.value.join('') : titleText,
)

onMounted(() => typing(titleText))

function typing(text: string) {
  if (!props.anim) return Promise.resolve()
  return new Promise((resolve) => {
    const types = typeJapaneseCharsMap(text, null, true).map((v) => ({
      jc: v.jc,
      ec: v.ec.split(''),
    }))

    const fins = []
    const bufs = []
    const type = async () => {
      startAnim.value = true

      const val = types.shift()
      if (val) {
        if (val.ec.length > 1) {
          types.unshift(val)
        }
        bufs.push(val.ec.shift())
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

const menus = [
  { route: { name: 'game-menu' }, label: 'プレイする' },
  { route: { name: 'index-problems' }, label: '問題いちらん' },
  { route: { name: 'index-about' }, label: 'サイト説明' },
]
</script>

<style lang="scss" scoped>
.basic-header {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100px;
  z-index: 99;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: rgba(0, 0, 0, 0.15) 0 1px 3px 0;
  display: flex;
  justify-content: center;
  padding: 10px;
  @media print {
    height: unset;
    position: relative;
    padding-top: 25px;
  }

  &-nav {
    height: 100%;
    padding-left: 10px;
    padding-right: 10px;
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    @media print {
      max-width: unset;
    }
    &-main {
      flex: 1;
      display: flex;
      align-items: center;

      h1 {
        color: rgba(255, 145, 0, 1);
        height: 100%;
        font-size: 1.5em;
        line-height: 1;
        display: flex;
        align-items: center;

        a {
          cursor: pointer;
          color: inherit;
          text-decoration: none;
          &.title-no-anim {
            opacity: 0;
          }

          @media print {
            &.title-anim {
              display: none;
            }
            &.title-no-anim {
              opacity: 1;
            }
          }
        }
      }
    }

    &-sub {
      @media print {
        display: none;
      }
      &-menu {
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;

        ul {
          display: flex;
          justify-content: space-around;
          list-style: none;
          padding: 0 10px;
          width: 100%;

          & > li {
            flex: 1;
            text-align: center;

            a {
              cursor: pointer;
              color: #666;
              text-decoration: none;
              white-space: nowrap;

              &:hover,
              &:focus {
                color: #999;
              }
            }
          }
        }
      }
    }
  }
}
</style>
