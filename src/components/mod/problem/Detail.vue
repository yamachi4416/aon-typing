<template>
  <div class="problem-detail">
    <PartsSection>
      <header>
        <span>No.{{ detail.id }}</span>
        <h2>{{ detail.title }}</h2>
      </header>
      <table>
        <tbody>
          <tr>
            <th>タグ</th>
            <td>
              <ModProblemTags
                :tags="detail.tags"
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
    <ol class="row">
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
import { ProblemDetail, ProblemItemTag } from '~~/types/problems'
defineProps<{
  detail: ProblemDetail
}>()

defineEmits<{
  (e: 'tag', tag: ProblemItemTag): any
}>()
</script>

<style lang="scss" scoped>
@use '~/assets/css/cmps';

.problem-detail {
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
</style>
