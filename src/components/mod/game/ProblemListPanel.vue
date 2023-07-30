<template>
  <PartsModalContent
    ref="content"
    class="typing-menu-panel"
    title="タイピング問題の選択"
    :show-close="true"
    @close="$emit('close')"
  >
    <div v-show="tags.size > 0" class="taglist">
      <button
        v-for="t in tags.values()"
        :key="`tag-${t.id}`"
        :title="`「${t.name}」タグの問題のみ表示するのをやめる`"
        @click.self="removeTag(t)"
      >
        {{ t.name }}
      </button>
    </div>
    <ModProblemList :problems="pages.items" @tag="addTag">
      <template #default="{ problem }">
        <button @click.self="$emit('detail', problem)">内容を見る</button>
        <button @click.self="$emit('select', problem)">選択する</button>
      </template>
    </ModProblemList>
    <template v-if="pages.pages > 1" #footer>
      <PartsPagenate
        :record-count="pages.count"
        :page="page"
        :page-size="pageSize"
        @select="selcet"
      />
    </template>
  </PartsModalContent>
</template>

<script setup lang="ts">
import ModalContentVue from '~/components/parts/ModalContent.vue'
import { ProblemItemTag, ProblemListItem } from '~~/types/problems'
import { pagenate } from '~~/libs/Util'

defineEmits<{
  (e: 'select', item: ProblemListItem): any
  (e: 'detail', item: ProblemListItem): any
  (e: 'tag', item: ProblemItemTag): any
  (e: 'close'): any
}>()

const { problems, filterTagProblems } = useProblems()
const pageSize = 30
const page = ref(1)

const tags = ref(new Map<string, ProblemItemTag>())
const filterProblems = filterTagProblems({
  problems,
  tags: computed(() => tags.value.keys()),
})
const pages = computed(() =>
  pagenate({
    items: filterProblems.value,
    page: page.value,
    pageSize,
  }),
)

const content = ref<InstanceType<typeof ModalContentVue>>()

async function selcet(p: number) {
  page.value = p
  await nextTick()
  content.value?.scroll({ top: 0 })
}

function addTag(tag: ProblemItemTag) {
  if (!tags.value.has(tag.id)) {
    tags.value.set(tag.id, tag)
  }
}

function removeTag(tag: ProblemItemTag) {
  if (tags.value.has(tag.id)) {
    tags.value.delete(tag.id)
  }
}
</script>

<style scoped lang="scss">
@use '~/assets/css/cmps';

.taglist {
  @include cmps.buttons;

  position: sticky;
  top: 0;
  z-index: 2;
  justify-content: flex-start;
  padding: 10px;
  font-size: 0.8rem;
  background-color: var(--color-f);
  border-bottom: 1px solid var(--color-9);
}
</style>
