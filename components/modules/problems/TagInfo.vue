<template>
  <para-section>
    <div class="tag-info">
      <div class="tag-info-id">No.{{ tag.id }}</div>
      <h2 class="tag-info-title">タグ：{{ tag.name }}</h2>
      <div ref="taglist" class="tag-info-taglist buttons">
        <span v-for="t in tags" :key="`tag-${t.id}`">
          <button
            class="tag-info-taglist-item button"
            :selected="selectedTagSet.has(t.id)"
            @click="filterTag(t)"
          >
            {{ t.name }}
          </button>
        </span>
      </div>
      <slot v-if="$slots.default" name="default" />
    </div>
    <template v-if="$slots.right" #right>
      <slot name="right" />
    </template>
  </para-section>
</template>

<script>
import ParaSection from '~/components/parts/ParaSection.vue'
export default {
  components: { ParaSection },
  props: {
    tag: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tags() {
      const tag = this.tag
      const tags = tag.problems.reduce((a, p) => {
        p.tags.forEach((t) => {
          if (!a[t.id]) {
            a[t.id] = {
              ...t,
              count: 1,
            }
          } else {
            a[t.id].count++
          }
        })
        return a
      }, {})

      Object.values(tags).forEach((t) => {
        if (t.count === tag.problems.length) {
          delete tags[t.id]
        }
      })

      return tags
    },
    selectedTags() {
      return this.$route.query.tags
        ? this.$route.query.tags.split(',').filter((id) => this.tags[id])
        : []
    },
    selectedTagSet() {
      return new Set(this.selectedTags)
    },
  },
  watch: {
    selectedTags(tags) {
      this.$emit('tags', tags)
    },
  },
  mounted() {
    this.$emit('tags', this.selectedTags)
  },
  updated() {
    this.$emit('tags', this.selectedTags)
  },
  methods: {
    filterTag(tag) {
      const query = { ...this.$route.query }
      const tags = this.selectedTags
      delete query.page

      if (this.selectedTagSet.has(tag.id)) {
        tags.splice(tags.indexOf(tag.id), 1)
      } else {
        tags.push(tag.id)
      }

      if (tags.length) {
        query.tags = tags.join(',')
      } else {
        delete query.tags
      }

      this.$router.replace({ query })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/css/vars.scss';

.tag-info {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

  &-type,
  &-id {
    padding: 5px;
  }

  &-taglist {
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-top: 10px;

    & > * {
      padding-left: 0;
    }

    &-item {
      border: none;
      padding: 0 1em;
      color: #666;
      &[selected] {
        color: #fff;
        background: #ff9900;
      }
    }
  }
}
</style>
