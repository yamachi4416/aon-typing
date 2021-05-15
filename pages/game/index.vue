<template>
  <typing-menu-panel
    class="typing-menu-page"
    :show="show"
    @start="startTyping"
    @cancel="cancel"
  />
</template>

<script>
import TypingMenuPanel from '~/components/panels/TypingMenuPanel.vue'

export default {
  components: { TypingMenuPanel },

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
      this.show = false
      setTimeout(() => {
        this.$router.push({ name: 'game-play' })
      }, 300)
    },

    cancel() {
      this.show = false
      setTimeout(() => {
        if (this.backUrl) {
          this.$router.back()
        } else {
          this.$router.replace('/')
        }
      }, 300)
    },
  },
}
</script>
