<template>
  <PartsModalContent
    ref="content"
    class="typing-menu-panel"
    :show-close="true"
    @close="$emit('close')"
  >
    <template #title> タイピング問題の選択 </template>
    <div v-show="tags.size > 0" class="taglist buttons">
      <span v-for="t in tags.values()" :key="`tag-${t.id}`">
        <button class="taglist-item button" @click.self="removeTag(t)">
          {{ t.name }}
        </button>
      </span>
    </div>
    <ModProblemList :problems="pages.items" @tag="addTag">
      <template #default="{ problem }">
        <div class="buttons">
          <span>
            <button class="button" @click.self="$emit('detail', problem)">
              内容を見る
            </button>
          </span>
          <span>
            <button class="button" @click.self="$emit('select', problem)">
              選択する
            </button>
          </span>
        </div>
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
  (e: 'select', item: ProblemListItem)
  (e: 'detail', item: ProblemListItem)
  (e: 'tag', item: ProblemItemTag)
  (e: 'close')
}>()

const pageSize = 30
const page = ref(1)

const tags = ref(new Map<string, ProblemItemTag>())
const pages = computed(() =>
  pagenate({
    items: useProblems().problemTagFilter({
      qtags: [...tags.value.keys()],
    }),
    page: page.value,
    pageSize,
  }),
)

const content = ref<InstanceType<typeof ModalContentVue>>()

async function selcet(p: number) {
  page.value = p
  await nextTick()
  content.value.scroll({ top: 0 })
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
.taglist {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 2;
  font-size: 0.8rem;
  justify-content: flex-start;
  padding: 10px;
  border-bottom: 1px solid #999;
}
</style>
