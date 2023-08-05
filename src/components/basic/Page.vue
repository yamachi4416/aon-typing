<template>
  <section :class="$style.page">
    <BasicHeader v-if="showHeader" :anim="anim" />
    <main>
      <slot />
    </main>
    <BasicFooter v-if="showFooter" />
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    anim?: boolean
    showHeader?: boolean
    showFooter?: boolean
  }>(),
  {
    anim: true,
    showHeader: true,
    showFooter: true,
  },
)
</script>

<style lang="scss" module>
@use '~/assets/css/vars';

.page {
  min-height: 100vh;

  @media print {
    min-height: unset;
  }

  & > main {
    max-width: 1000px;
    min-height: calc(100vh - 200px);
    padding: 10px;
    margin: 0 auto;

    @include vars.media_s {
      padding: 5px 0;
    }

    @media print {
      padding: 3px;
    }
  }
}
</style>
