<template>
  <div class="problem-detail-page">
    <PartsSection>
      <div class="detail-header">
        <div class="detail-info">
          <div class="detail-info-id">
            <span>No.{{ detail.id }}</span>
          </div>
          <h2 class="detail-info-title">{{ detail.title }}</h2>
          <div class="detail-info-info">
            <dl>
              <dt>タグ</dt>
              <dd class="detail-info-info-tags">
                <div class="detail-info-info-tags-list buttons">
                  <span v-for="(tag, i) in detail.tags" :key="`tag-${i}`">
                    <button
                      class="detail-info-info-tags-list-item button"
                      @click="$emit('tag', tag)"
                    >
                      {{ tag.name }}
                    </button>
                  </span>
                </div>
              </dd>
            </dl>
            <dl
              v-if="detail.links && detail.links.length"
              class="detail-info-info-links"
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
    <div>
      <ol class="details row">
        <li
          v-for="(w, i) in detail.words"
          :key="i"
          class="details-item col-s-12 col-m-6 col-4"
        >
          <PartsSection class="details-item-inner">
            <div class="detail-card">
              <div class="detail-card-no">No.{{ i + 1 }}</div>
              <div class="detail-card-info">{{ w.info || w.info2 }}</div>
              <div class="detail-card-word">{{ w.word }}</div>
            </div>
          </PartsSection>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProblemDetail, ProblemItemTag } from "~/types/problems";
defineProps<{
  detail: ProblemDetail;
}>();

defineEmits<{
  (e: "tag", tag: ProblemItemTag);
}>();
</script>

<style lang="scss" scoped>
@import "~/assets/css/vars.scss";

.problem-detail-page {
  .detail-header {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;

    .detail-info {
      &-id,
      &-info {
        padding: 5px;
      }

      &-info {
        font-size: 1em;

        &-links {
          ul {
            list-style: none;
          }
        }

        & > * {
          display: flex;
          align-items: center;

          & > * {
            flex: 1;
          }

          & > dt {
            padding: 5px 0px;
            color: #666;
            white-space: nowrap;
            max-width: 5em;
          }
          & > dd {
            padding: 5px;
            color: #666;
            flex: 1;
          }
        }
      }

      .detail-info-info-tags {
        &-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          & > * {
            padding-left: 0;
          }
          &-item {
            font-size: 0.85em;
            background: rgba(255, 153, 0, 1);
            color: #fff;
            padding: 0 1em;
            border: none;
          }
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
  }

  .details {
    display: flex;
    list-style-type: none;
    flex-wrap: wrap;

    &-item {
      display: flex;

      &-inner {
        flex-grow: 1;
      }
    }

    .detail-card {
      display: flex;
      flex-direction: column;
      color: #666;

      &-word {
        word-break: break-all;
      }
    }
  }
}
</style>
