<template>
  <div>
    <PartsSection
      :aria-labelledby="`title-${uid}`"
      :class="$style['page-header']"
    >
      <header>
        <span>No.{{ detail.id }}</span>
        <h2 :id="`title-${uid}`">{{ detail.title }}</h2>
      </header>
      <table>
        <tbody>
          <tr>
            <th>タグ</th>
            <td>
              <ModProblemTags
                :class="$style.tags"
                :tags="detail.tags"
                :clickable="hasOnTag"
                @tag="(tag) => $emit('tag', tag)"
              />
            </td>
          </tr>
          <tr v-if="detail.links && detail.links.length">
            <th>引用元</th>
            <td>
              <ul :class="$style['detail-links']">
                <li v-for="(link, i) in detail.links" :key="`detail-link-${i}`">
                  <a :href="link.link" target="_blank">
                    {{ link.site }}：{{ link.name }}
                  </a>
                </li>
              </ul>
            </td>
          </tr>
          <tr v-if="railway">
            <th>鉄道会社</th>
            <td>
              <a
                v-if="hasOnRailway"
                :class="$style['railway-link']"
                @click.prevent="$emit('railway', railway)"
              >
                {{ railway.name }}
              </a>
              <span v-else>{{ railway.name }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <footer v-if="$slots.default">
        <slot />
      </footer>

      <template v-if="$slots.right" #right>
        <slot name="right" />
      </template>
    </PartsSection>
    <ol
      class="row"
      :aria-label="`「${detail.title}」の問題いちらん`"
      :class="$style.words"
    >
      <li
        v-for="(w, i) in detail.words"
        :key="i"
        class="col-s-12 col-m-6 col-4"
      >
        <div>
          <div>No.{{ i + 1 }}</div>
          <div>{{ w.info || w.info2 }}</div>
          <div>{{ w.word }}</div>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import type { ProblemDetail, ProblemItemTag } from '~~/types/problems'

const props = defineProps<{
  detail: ProblemDetail
}>()

defineEmits<{
  (e: 'tag', tag: ProblemItemTag): any
  (e: 'railway', railway: { code: string }): any
}>()

const uid = useId()
const hasOnTag = computed(() => !!getCurrentInstance()?.vnode?.props?.onTag)
const hasOnRailway = computed(
  () => !!getCurrentInstance()?.vnode?.props?.onRailway,
)
const { getCorporation } = useRailways()
const railway = computed(() =>
  props.detail.optional?.coCd?.[0]
    ? getCorporation(props.detail.optional.coCd[0])
    : undefined,
)
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.page-header {
  @include cmps.pageHeader;
}

.detail-links {
  list-style: none;
}

.words {
  @include cmps.listCard;
}

.tags {
  padding: 3px 0;
}

.railway-link {
  cursor: pointer;
}
</style>
