<template>
  <div class="typing-menu-page">
    <typing-menu-panel
      :show="show"
      @start="startTyping"
      @cancel="cancel"
      @openProblemSelect="openProblemSelect"
    />
    <nuxt-child />
  </div>
</template>

<script>
import TypingMenuPanel from '~/components/panels/TypingMenuPanel.vue'
import { ModalContentMixin } from '~/mixins/ModalContentMixin'

export default {
  components: { TypingMenuPanel },
  mixins: [ModalContentMixin],
  beforeRouteLeave(to, from, next) {
    this.show = false
    setTimeout(() => {
      next()
    }, 300)
  },

  head() {
    return {
      title: 'タイピングメニュー',
    }
  },

  methods: {
    startTyping() {
      this.$router.push({ name: 'game-play' })
    },

    openProblemSelect() {
      this.$router.push({ name: 'game-menu-problems' })
    },

    cancel() {
      this.backOrReplace({ name: 'index' }, /^index/)
    },
  },
}
</script>
