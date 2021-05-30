<template>
  <div class="problem-list-item">
    <header class="problem-list-item-header">
      <h2>
        <span class="problem-list-item-header-no">No.{{ item.id }}</span>
        <span class="problem-list-item-header-title">{{ item.title }}</span>
      </h2>
    </header>
    <main class="problem-list-item-main">
      <div class="problem-list-item-main-detail">
        <div class="problem-list-item-main-detail-row">
          <label>タイプ</label>
          <div>{{ item.type }}</div>
        </div>
        <div class="problem-list-item-main-detail-row">
          <label>問題数</label>
          <div>{{ item.words }}</div>
        </div>
        <div class="problem-list-item-main-detail-row">
          <label>タイピング数</label>
          <div>{{ item.chars }}</div>
        </div>
        <div class="problem-list-item-main-detail-row">
          <label>登録日</label>
          <div>
            <time :datetime="item.createdAt">{{ item.createdAt }}</time>
          </div>
        </div>
        <div class="problem-list-item-main-detail-tags">
          <div class="problem-list-item-main-detail-tags-list buttons">
            <button
              v-for="(tag, i) in item.tags"
              :key="`tag-${item.id}-${i}`"
              class="problem-list-item-main-detail-tags-list-item button"
              @click="$emit('tag', tag)"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
      </div>
    </main>
    <footer v-if="$slots.footer" class="problem-list-item-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.problem-list-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #666;
  height: 100%;

  &-header {
    text-align: center;
    & > h2 {
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
        & > div {
          flex: 1;
          text-align: right;
          padding: 5px 15px;
        }
        & > label {
          flex: 1;
          text-align: left;
          white-space: nowrap;
        }
      }
      &-tags {
        &-list {
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 5px;
          padding: 10px 5px;
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
}
</style>
