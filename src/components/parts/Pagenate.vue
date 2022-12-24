<template>
  <div v-if="pages.length > 1" class="pagenate buttons">
    <span v-for="p in dispPages" :key="p">
      <select
        v-if="p === page"
        v-model.number="editPage"
        class="button"
        selected
      >
        <option v-for="c in pages" :key="c" :value="c">
          {{ c }}
        </option>
      </select>
      <button v-else class="button" @click="editPage = p">{{ p }}</button>
    </span>
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
.pagenate {
  padding-top: 5px;
  padding-bottom: 8px;

  .button {
    width: 3.8em;
    padding-right: 0;
    padding-left: 0;
    text-align: center;
  }
}
</style>
