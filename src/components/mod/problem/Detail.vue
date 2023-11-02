<template>
  <div :class="$style.detail">
    <PartsSection :aria-labelledby="`title-${uid}`">
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
              <ul>
                <li v-for="(link, i) in detail.links" :key="`detail-link-${i}`">
                  <a :href="link.link" target="_blank"
                    >{{ link.site }}：{{ link.name }}</a
                  >
                </li>
              </ul>
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
    <ol class="row" :aria-label="`「${detail.title}」の問題いちらん`">
      <li
        v-for="(w, i) in detail.words"
        :key="i"
        class="col-s-12 col-m-6 col-4"
      >
        <div>
          <div>No.{{ i + 1 }}</div>
          <div :id="`title-${uid}-${i}`">{{ w.info || w.info2 }}</div>
          <div>{{ w.word }}</div>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import type { ProblemDetail, ProblemItemTag } from '~~/types/problems'

defineProps<{
  detail: ProblemDetail
}>()

defineEmits<{
  (e: 'tag', tag: ProblemItemTag): any
}>()

const uid = getCurrentInstance()?.uid
const hasOnTag = computed(() => !!getCurrentInstance()?.vnode?.props?.onTag)
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.detail {
  header {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  ul {
    list-style: none;
  }

  footer {
    @include cmps.buttons;

    justify-content: flex-start;
    padding-top: 5px;
  }

  ol {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;

    & > li {
      @include cmps.card;

      & > div {
        @include cmps.paper;

        word-break: break-all;
      }
    }
  }
}

.tags {
  padding: 3px 0;
}
</style>
