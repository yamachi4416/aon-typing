<template>
  <div v-if="pages.length > 1" class="pagenation buttons">
    <span v-for="p in dispPages" :key="p">
      <select
        v-if="p === page"
        v-model.number="editPage"
        class="button"
        selected
      >
        <option v-for="c in pages" :key="c" :value="c">
          {{ c }}
        </option>
      </select>
      <button v-else class="button" @click="selectPage(p)">{{ p }}</button>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
  },
  computed: {
    editPage: {
      get() {
        return this.page
      },
      set(value) {
        this.selectPage(value)
      },
    },
    lastPage() {
      return Math.ceil(this.count / this.pageSize)
    },
    pages() {
      const ret = []
      const last = this.lastPage
      for (let i = 0; i < last; i++) {
        ret.push(i + 1)
      }
      return ret
    },
    dispPages() {
      const ret = []
      const start = Math.max(this.page - 1, 1)
      const last = Math.min(this.page + 1, this.lastPage)
      for (let i = start; i <= last; i++) {
        ret.push(i)
      }
      if (ret[0] !== 1) {
        ret.unshift(1)
      }
      if (ret[ret.length - 1] !== this.lastPage) {
        ret.push(this.lastPage)
      }
      return ret
    },
  },
  methods: {
    selectPage(page) {
      this.$emit('select', page)
    },
  },
}
</script>

<style lang="scss" scoped>
.pagenation {
  padding-top: 5px;
  padding-bottom: 8px;
}
</style>
