<template>
  <div>
    <ModProblemList :problems="pages.items" @tag="(tag) => emit('tag', tag)">
      <template #default="{ problem }">
        <div class="buttons">
          <span>
            <button class="button" @click="$emit('detail', problem)">
              内容を見る
            </button>
          </span>
          <span>
            <button class="button" @click="$emit('play', problem)">
              プレイする
            </button>
          </span>
        </div>
      </template>
    </ModProblemList>
    <PartsPagenate
      :page="page"
      :pageSize="props.pageSize"
      :recordCount="pages.count"
      @select="select"
    />
  </div>
</template>

<script setup lang="ts">
import { ProblemItemTag, ProblemListItem } from "~~/types/problems";
import { pagenate } from "~/libs/Util";

const props = withDefaults(
  defineProps<{
    problems: ProblemListItem[];
    pageSize?: number;
  }>(),
  {
    problems: () => [],
    pageSize: 30,
  }
);

const emit = defineEmits<{
  (e: "tag", tag: ProblemItemTag);
  (e: "detail", p: ProblemListItem);
  (e: "play", p: ProblemListItem);
}>();

const route = useRoute();
const router = useRouter();

const path = ref(route.path);
const page = ref(Number(route.query.page || 1));
const pages = computed(
  () =>
    pagenate({
      items: props.problems,
      page: page.value,
      pageSize: props.pageSize,
    })
);

watch(
  () => route.query.page,
  (to, from) => {
    if (path.value === route.path && to !== from) {
      const nextPage = Number(to) || 1;
      if (page.value !== nextPage) {
        page.value = nextPage;
      }
    }
  }
);

function select(p: number) {
  router.push({ query: { ...route.query, page: String(p) } });
}
</script>

<style lang="scss" scoped>
@import "~/assets/css/vars.scss";

.problem-list {
  &-item {
    display: flex;
    justify-content: center;

    &-inner {
      flex: 1;
    }

    @include __media_l {
      &:nth-of-type(3n + 1) {
        justify-content: flex-start;
      }
      &:nth-of-type(3n) {
        justify-content: flex-end;
      }
    }

    @include __media_m {
      &:nth-of-type(2n + 1) {
        justify-content: flex-start;
      }
      &:nth-of-type(2n) {
        justify-content: flex-end;
      }
    }
  }
}
</style>
