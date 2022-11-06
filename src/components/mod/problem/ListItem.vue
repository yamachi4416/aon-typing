<template>
  <div class="item">
    <header class="item-header">
      <h3>
        <span class="item-header-no">No.{{ item.id }}</span>
        <span class="item-header-title">{{ item.title }}</span>
      </h3>
    </header>
    <main class="item-main">
      <div class="item-main-detail">
        <div class="item-main-detail-row">
          <label>問題数</label>
          <div>{{ item.words }}</div>
        </div>
        <div class="item-main-detail-row">
          <label>タイピング数</label>
          <div>{{ item.chars }}</div>
        </div>
        <div class="item-main-detail-tags buttons">
          <span v-for="(tag, i) in item.tags" :key="`tag-${item.id}-${i}`">
            <button
              class="item-main-detail-tags-item button"
              @click="$emit('tag', tag)"
            >
              {{ tag.name }}
            </button>
          </span>
        </div>
      </div>
    </main>
    <footer v-if="$slots.footer" class="item-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ProblemItemTag, ProblemListItem } from '~~/types/problems'

defineProps<{
  item: ProblemListItem
}>()

defineEmits<{
  (e: 'tag', tag: ProblemItemTag): any
}>()
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #666;

  &-header {
    text-align: center;

    & > h3 {
      display: flex;
      flex-direction: column;
      font-size: 1em;
      font-weight: normal;
    }

    &-no {
      position: absolute;
      top: 8px;
      left: 20px;
      font-size: 0.8em;
      text-align: left;
    }

    &-title {
      flex: 1;
    }
  }

  &-main {
    flex: 1;
    border-top: 1px solid #999;

    &-detail {
      padding: 5px;

      &-tags {
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: 10px 5px;

        & > * {
          padding-left: 0;
        }

        &-item {
          padding: 0 8px;
          font-size: 0.8em;
          color: #fff;
          background: rgb(255 153 0 / 100%);
          border: none;
        }
      }

      &-row {
        display: flex;

        & > *:not(label) {
          flex: 1;
          padding: 5px 15px;
          text-align: right;
        }

        & > label {
          flex: 1;
          text-align: left;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
