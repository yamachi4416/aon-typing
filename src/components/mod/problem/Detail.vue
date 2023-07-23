<template>
  <div class="problem-detail-page">
    <PartsSection>
      <div class="detail-header">
        <div class="detail-info">
          <div class="id">
            <span>No.{{ detail.id }}</span>
          </div>
          <h2 class="title">
            {{ detail.title }}
          </h2>
          <div class="info">
            <dl class="detail-info-tags">
              <dt>タグ</dt>
              <dd>
                <div class="buttons">
                  <span v-for="(tag, i) in detail.tags" :key="`tag-${i}`">
                    <button class="button" @click="$emit('tag', tag)">
                      {{ tag.name }}
                    </button>
                  </span>
                </div>
              </dd>
            </dl>
            <dl
              v-if="detail.links && detail.links.length"
              class="detail-info-links"
            >
              <dt>引用元</dt>
              <dd>
                <ul>
                  <li
                    v-for="(link, i) in detail.links"
                    :key="`detail-link-${i}`"
                  >
                    <a :href="link.link" target="_blank"
                      >{{ link.site }}：{{ link.name }}</a
                    >
                  </li>
                </ul>
              </dd>
            </dl>
          </div>
        </div>
        <div class="detail-actions">
          <div class="buttons">
            <slot />
          </div>
        </div>
      </div>
      <template v-if="$slots.right" #right>
        <slot name="right" />
      </template>
    </PartsSection>
    <ol class="details row">
      <PartsCard
        is="li"
        v-for="(w, i) in detail.words"
        :key="i"
        class="details-item"
      >
        <div>No.{{ i + 1 }}</div>
        <div>{{ w.info || w.info2 }}</div>
        <div>{{ w.word }}</div>
      </PartsCard>
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
@import '~/assets/css/vars';

.problem-detail-page {
  .detail-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .detail-info {
    .id,
    .info {
      padding: 5px;
    }

    .info {
      font-size: 1em;
    }
  }

  .detail-info-links,
  .detail-info-tags {
    display: flex;
    align-items: center;

    & > * {
      flex: 1;
    }

    & > dt {
      max-width: 5em;
      padding: 5px 0;
      color: var(--color-6);
      white-space: nowrap;
    }

    & > dd {
      flex: 1;
      padding: 5px;
      color: var(--color-6);
    }
  }

  .detail-info-links {
    ul {
      list-style: none;
    }
  }

  .detail-info-tags {
    .buttons {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      & > * {
        padding-left: 0;
      }

      .button {
        padding: 0 1em;
        font-size: 0.85em;
        color: var(--color-f);
        background: var(--color-p);
        border: none;
      }
    }
  }

  .detail-actions {
    padding-top: 5px;

    .buttons {
      display: flex;
      justify-content: flex-start;
    }
  }

  .details {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;

    :where(.details-item) {
      display: flex;
      flex-direction: column;
      color: var(--color-6);
      word-break: break-all;
    }
  }
}
</style>
