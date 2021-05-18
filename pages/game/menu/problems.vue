<template>
  <div class="problem-select-page">
    <problem-select-panel
      :show="show"
      :problems="problems"
      @select="close"
      @cancel="close"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProblemSelectPanel from '~/components/panels/ProblemSelectPanel.vue'
export default {
  components: { ProblemSelectPanel },
  props: {
    backUrl: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapGetters({
      problems: 'problems/problems',
    }),
  },
  mounted() {
    this.show = true
  },
  methods: {
    close() {
      this.show = false
      setTimeout(() => {
        if (this.backUrl) {
          this.$router.back()
        } else {
          this.$router.replace({ name: 'game-menu' })
        }
      }, 300)
    },
  },
}
</script>

<style lang="scss">
.problem-select-page {
  .para-section-main {
    border: 2px solid #333;
    .problem-list-item {
      color: #333;
    }
  }
}
</style>
