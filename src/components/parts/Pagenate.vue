<template>
  <div v-if="pages.length > 1" :class="$style.pagenate">
    <template v-for="p in dispPages" :key="p">
      <label v-if="p === page" title="表示するページを選択" selected>
        {{ editPage }}
        <select v-model.number="editPage">
          <option v-for="c in pages" :key="c" :value="c">
            {{ c }}
          </option>
        </select>
      </label>
      <a
        v-else
        href="#"
        :title="`${p}ページ目を表示する`"
        :aria-label="`${p}ページ目を表示する`"
        @click.prevent="editPage = p"
      >
        {{ p }}
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    page: number
    pageSize?: number
    recordCount: number
  }>(),
  {
    pageSize: 30,
  },
)

const emit = defineEmits<{
  (e: 'select', page: number): any
}>()

const editPage = computed({
  get() {
    return props.page
  },
  set(value) {
    selectPage(value)
  },
})

const lastPage = computed(() => Math.ceil(props.recordCount / props.pageSize))
const pages = computed(() => [...Array(lastPage.value)].map((_, i) => i + 1))
const dispPages = computed(() => {
  const lp = lastPage.value
  const cp = props.page
  let wp = [cp - 1, cp, cp + 1]
  if (cp <= 2) {
    wp = [2, 3, 4]
  } else if (lp - 1 <= cp) {
    wp = [lp - 3, lp - 2, lp - 1]
  }
  return new Set([1, ...wp, lp].filter((p) => p >= 1 && p <= lp))
})

function selectPage(page: number) {
  emit('select', page)
}
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.pagenate {
  @include cmps.buttons;

  padding-top: 5px;
  padding-bottom: 8px;

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
