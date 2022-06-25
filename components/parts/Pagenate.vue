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
    page: number;
    pageSize?: number;
    recordCount: number;
  }>(),
  {
    pageSize: 30,
  }
);

const emit = defineEmits<{
  (e: "select", page: number);
}>();

const editPage = computed({
  get() {
    return props.page;
  },
  set(value) {
    selectPage(value);
  },
});

const lastPage = computed(() => Math.ceil(props.recordCount / props.pageSize));
const pages = computed(() => [...Array(lastPage.value)].map((_, i) => i + 1));
const dispPages = computed(() => {
  const ret = [];
  const start = Math.max(props.page - 1, 1);
  const last = Math.min(props.page + 1, lastPage.value);
  for (let i = start; i <= last; i++) {
    ret.push(i);
  }
  if (ret[0] !== 1) {
    ret.unshift(1);
  }
  if (ret[ret.length - 1] !== lastPage.value) {
    ret.push(lastPage.value);
  }
  return ret;
});

function selectPage(page: number) {
  emit("select", page);
}
</script>

<style lang="scss" scoped>
.pagenate {
  padding-top: 5px;
  padding-bottom: 8px;
}
</style>
