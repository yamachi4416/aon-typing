<template>
  <div class="problem-list-item">
    <header class="problem-list-item-header">
      <h2>
        <span class="problem-list-item-header-no">No.{{ item.id }}</span>
        <span class="problem-list-item-header-title">{{ item.title }}</span>
      </h2>
    </header>
    <main class="problem-list-item-main">
      <div class="table">
        <div>
          <label>タイプ</label>
          <div>{{ item.type }}</div>
        </div>
        <div>
          <label>問題数</label>
          <div>{{ item.words }}</div>
        </div>
        <div>
          <label>タイピング数</label>
          <div>{{ item.chars }}</div>
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
  }
}
</style>
