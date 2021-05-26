<template>
  <div class="typing-menu-page">
    <typing-menu-panel
      :show="show"
      @start="startTyping"
      @cancel="cancel"
      @openProblemSelect="openProblemSelect"
    />
    <nuxt-child :back-url="backUrl" />
  </div>
</template>

<script>
import TypingMenuPanel from '~/components/panels/TypingMenuPanel.vue'

export default {
  components: { TypingMenuPanel },
  beforeRouteLeave(to, from, next) {
    this.show = false
    setTimeout(() => {
      next()
    }, 300)
  },
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

  head() {
    return {
      title: 'タイピングメニュー',
    }
  },

  mounted() {
    this.show = true
  },

  methods: {
    startTyping() {
      this.$router.push({ name: 'game-play' })
    },

    openProblemSelect() {
      this.$router.push({ name: 'game-menu-problems' })
    },

    cancel() {
      if (this.backUrl) {
        this.$router.back()
      } else {
        this.$router.replace('/')
      }
    },
  },
}
</script>
