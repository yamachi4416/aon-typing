<template>
  <typing-menu-panel v-model="setting" :show="true" @start="startTyping" />
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import TypingMenuPanel from '~/components/panels/TypingMenuPanel.vue'

export default {
  components: { TypingMenuPanel },

  computed: {
    ...mapGetters({
      typingSetting: 'typingSetting/setting',
    }),

    setting: {
      get() {
        return this.typingSetting
      },
      set(value) {
        this.setSetting(value)
      },
    },
  },

  methods: {
    ...mapMutations({
      setSetting: 'typingSetting/setSetting',
    }),

    startTyping() {
      this.$router.push({ name: 'game-play' })
    },
  },
}
</script>
