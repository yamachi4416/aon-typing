<template>
  <div>
    <div
      v-for="p in problems"
      :key="p.id"
      @click="
        $router.push({ name: 'index-problems-detail', query: { id: p.id } })
      "
    >
      {{ p }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      problems: 'problems/problems',
    }),
  },
}
</script>
