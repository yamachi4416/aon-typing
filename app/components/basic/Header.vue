<template>
  <header :class="$style.header" role="banner">
    <section>
      <BasicHeaderTitle :name :anim />
      <BasicHeaderThemeChagne />
    </section>
    <BasicHeaderNavigation />
  </header>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    anim?: boolean
  }>(),
  {
    anim: true,
  },
)
</script>

<style lang="scss" module>
.header {
  position: sticky;
  top: 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  padding: 10px;
  background: var(--page-header-background);
  box-shadow: var(--shadow-color-md) 0 1px 3px 0;

  @media print {
    position: relative;
    height: unset;
    padding-top: 25px;
    background: var(--color-f);
  }

  & > * {
    width: 100%;
    max-width: 1000px;
    padding-right: 10px;
    padding-left: 10px;

    @media print {
      max-width: unset;
    }
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  & > section {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;

    h1 {
      display: flex;
      align-items: center;
      height: 100%;
      font-size: 1.5em;
      line-height: 1;
      color: var(--color-p);

      a {
        color: inherit;

        &:hover,
        &:focus {
          color: inherit;
        }
      }
    }
  }
}
</style>
