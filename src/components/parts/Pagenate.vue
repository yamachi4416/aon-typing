<template>
  <slot :items="pages.items" />
  <ClientOnly>
    <div v-if="pages.last > 1" :class="$style.pagenate">
      <template v-for="p in pages.pagenate" :key="p">
        <label v-if="p === page" title="表示するページを選択" selected>
          {{ p }}
          <select v-model.number="page">
            <option v-for="c in pages.last" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </label>
        <a
          v-else
          href="#"
          :title="`${p}ページ目を表示する`"
          :aria-label="`${p}ページ目を表示する`"
          @click.prevent="page = p"
        >
          {{ p }}
        </a>
      </template>
    </div>
  </ClientOnly>
</template>

<script setup generic="T" lang="ts">
import { pagenate } from '~~/libs/Util'

const props = withDefaults(
  defineProps<{
    items: T[]
    pageSize?: number
  }>(),
  {
    pageSize: 30,
  },
)

const page = defineModel<number>({ required: true })

const pages = computed(() =>
  pagenate({
    items: props.items,
    page: page.value,
    pageSize: props.pageSize,
  }),
)

watch(
  () => pages.value.last,
  (last) => {
    if (page.value > last) {
      page.value = last || 1
    }
  },
)
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.pagenate {
  @include cmps.buttons {
    padding-top: 5px;
    padding-bottom: 8px;
  }

  a,
  label {
    width: 3.8em;
    padding-right: 0;
    padding-left: 0;
    text-align: center;
  }

  label {
    position: relative;

    select {
      position: absolute;
      inset: 0;
      opacity: 0;
    }
  }
}
</style>
