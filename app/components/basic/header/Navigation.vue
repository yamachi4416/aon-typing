<template>
  <nav :class="$style.nav" role="navigation">
    <ul>
      <li v-for="({ to, label }, i) in menus" :key="i">
        <NuxtLink :to>{{ label }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const menus = routeRecords([
  { to: { name: 'game-menu' }, label: 'プレイする' },
  { to: { name: 'index-problems' }, label: '問題いちらん' },
  { to: { name: 'index-about' }, label: 'サイト説明' },
])
</script>

<style lang="scss" module>
.nav {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;

  @media print {
    display: none;
  }

  ul {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 0 10px;
    list-style: none;

    & > li {
      flex: 1;
      text-align: center;
      white-space: nowrap;
    }

    a {
      color: var(--color-6);
      text-decoration: none;

      &:hover,
      &:focus {
        color: var(--color-9);
      }
    }
  }
}
</style>
