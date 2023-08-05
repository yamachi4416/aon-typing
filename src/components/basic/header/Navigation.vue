<template>
  <nav :class="$style.nav" role="navigation">
    <ul>
      <li v-for="(menu, i) in menus" :key="`menu-${i}`">
        <NuxtLink :to="menu.route">
          {{ menu.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const menus = [
  { route: { name: 'game-menu' }, label: 'プレイする' },
  { route: { name: 'index-problems' }, label: '問題いちらん' },
  { route: { name: 'index-about' }, label: 'サイト説明' },
]
</script>

<style lang="scss" module>
.nav {
  @media print {
    display: none;
  }

  width: 100%;
  max-width: 1000px;
  margin: 0 auto;

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
