<template>
  <section :class="$style.page">
    <BasicHeader v-if="showHeader" :name :anim />
    <main>
      <slot />
    </main>
    <BasicFooter v-if="showFooter" :copyright />
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

const { name, copyright } = useSiteConfig()
</script>

<style lang="scss" module>
@use '~/assets/css/vars';

.page {
  min-height: 100dvh;

  @media print {
    min-height: unset;
  }

  & > main {
    max-width: 1000px;
    min-height: calc(100dvh - 200px);
    padding: 10px;
    margin: 0 auto;

    @include vars.media_s {
      padding: 5px 0;
    }

    @media print {
      padding: 3px;
    }

    :where(:target) {
      scroll-margin-top: 130px;
    }
  }
}
</style>
