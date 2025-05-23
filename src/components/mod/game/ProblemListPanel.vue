<template>
  <PartsModalContent
    ref="content"
    title="タイピング問題の選択"
    :show-close="true"
    @close="$emit('close')"
  >
    <div v-show="tags.size > 0" :class="$style.tags">
      <button
        v-for="t in tags.values()"
        :key="`tag-${t.id}`"
        :title="`「${t.name}」タグの問題のみ表示するのをやめる`"
        @click.self="removeTag(t)"
      >
        {{ t.name }}
      </button>
    </div>
    <PartsPagenate
      v-slot="{ items }"
      :model-value="page"
      :items="filterProblems"
      :page-size="pageSize"
      @update:model-value="selcet"
    >
      <ModProblemList v-slot="{ problem }" :problems="items" @tag="addTag">
        <button @click.self="$emit('detail', problem)">内容を見る</button>
        <button @click.self="$emit('select', problem)">選択する</button>
      </ModProblemList>
    </PartsPagenate>
  </PartsModalContent>
</template>

<script setup lang="ts">
import type ModalContentVue from '~/components/parts/ModalContent.vue'
import type { ProblemItemTag, ProblemListItem } from '~~/types/problems'

defineEmits<{
  (e: 'select' | 'detail', item: ProblemListItem): unknown
  (e: 'tag', item: ProblemItemTag): unknown
  (e: 'close'): unknown
}>()

const { problems, filterTagProblems } = useProblems()
const { pageSize } = useRuntimeConfig().public
const page = ref(1)

const tags = ref(new Map<string, ProblemItemTag>())
const filterProblems = filterTagProblems({
  problems,
  tags: computed(() => tags.value.keys()),
})

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

<style lang="scss" module>
@use '~/assets/css/cmps';

.tags {
  @include cmps.buttons {
    position: sticky;
    top: 0;
    z-index: 2;
    justify-content: flex-start;
    padding: 10px;
    font-size: 0.8rem;
    background-color: var(--color-f);
    border-bottom: 1px solid var(--color-9);
  }
}
</style>
