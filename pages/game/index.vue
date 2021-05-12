<template>
  <game-layout class="game-manu-page" :fit-main="true">
    <typing-menu-panel
      :show="true"
      @start="startTyping"
      @cancel="$router.push(backUrl || '/')"
    />
  </game-layout>
</template>

<script>
import GameLayout from '~/components/layout/GameLayout.vue'
import TypingMenuPanel from '~/components/panels/TypingMenuPanel.vue'

export default {
  components: { TypingMenuPanel, GameLayout },
  props: {
    backUrl: {
      type: Object,
      default: () => ({}),
    },
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
  },
}
</script>

<style lang="scss" scoped>
.game-manu-page {
  background-image: url(~/static/img/back01.jpg);
}
</style>
