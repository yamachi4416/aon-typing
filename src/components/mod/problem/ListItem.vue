<template>
  <div class="item">
    <header>
      <h3>
        <span class="no">No.{{ item.id }}</span>
        <span class="title">{{ item.title }}</span>
      </h3>
    </header>
    <div class="content">
      <div class="detail">
        <div class="detail-row">
          <label>問題数</label>
          <div>{{ item.words }}</div>
        </div>
        <div class="detail-row">
          <label>タイピング数</label>
          <div>{{ item.chars }}</div>
        </div>
        <div class="detail-tags buttons">
          <span v-for="(tag, i) in item.tags" :key="`tag-${item.id}-${i}`">
            <button class="button" @click="$emit('tag', tag)">
              {{ tag.name }}
            </button>
          </span>
        </div>
      </div>
    </div>
    <footer v-if="$slots.footer">
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
  color: var(--color-6);

  & > header {
    text-align: center;

    h3 {
      display: flex;
      flex-direction: column;
      font-size: 1em;
      font-weight: normal;
    }

    .no {
      position: absolute;
      top: 8px;
      left: 20px;
      font-size: 0.8em;
      text-align: left;
    }

    .title {
      flex: 1;
    }
  }

  .content {
    flex: 1;
    border-top: 1px solid var(--color-9);
  }

  .detail {
    padding: 5px;
  }

  .detail-row {
    display: flex;

    & > div {
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

  .detail-tags {
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 10px 5px;

    & > * {
      padding-left: 0;
    }

    .button {
      padding: 0 8px;
      font-size: 0.8em;
      color: var(--color-f);
      background: var(--color-p);
      border: none;
    }
  }
}
</style>
