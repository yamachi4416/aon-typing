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
            <button class="item-main-detail-tags-item button" @click="$emit('tag', tag)">
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
import { ProblemItemTag, ProblemListItem } from '~/types/problems'

defineProps<{
  item: ProblemListItem;
}>()

defineEmits<{
  (e: 'tag', tag: ProblemItemTag);
}>()
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  color: #666;
  height: 100%;

  &-header {
    text-align: center;

    &>h3 {
      font-weight: normal;
      font-size: 1em;
      display: flex;
      flex-direction: column;
    }

    &-no {
      text-align: left;
      font-size: 0.8em;
      position: absolute;
      top: 8px;
      left: 20px;
    }

    &-title {
      flex: 1;
    }
  }

  &-main {
    border-top: 1px solid #999;
    flex: 1;

    &-detail {
      padding: 5px;

      &-row {
        display: flex;

        &>*:not(label) {
          flex: 1;
          text-align: right;
          padding: 5px 15px;
        }

        &>label {
          flex: 1;
          text-align: left;
          white-space: nowrap;
        }
      }

      &-tags {
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: 10px 5px;

        &>* {
          padding-left: 0;
        }

        &-item {
          font-size: 0.8em;
          background: rgba(255, 153, 0, 1);
          color: #fff;
          padding: 0 8px;
          border: none;
        }
      }
    }
  }
}
</style>
