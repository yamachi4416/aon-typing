<template>
  <div v-if="pages.length > 1" class="pagenate">
    <template v-for="p in dispPages" :key="p">
      <select
        v-if="p === page"
        v-model.number="editPage"
        title="表示するページを選択"
        selected
      >
        <option v-for="c in pages" :key="c" :value="c">
          {{ c }}
        </option>
      </select>
      <button v-else :title="`${p}ページ目を表示する`" @click="editPage = p">
        {{ p }}
      </button>
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

<style lang="scss" scoped>
@use '~/assets/css/cmps';

.pagenate {
  @include cmps.buttons;

  padding-top: 5px;
  padding-bottom: 8px;

  select {
    @include cmps.button;

    text-align: center;
  }

  button,
  select {
    width: 3.8em;
    padding-right: 0;
    padding-left: 0;
    text-align: center;
  }
}
</style>
