<template>
  <footer :class="$style.footer" role="contentinfo">
    <nav>
      <ul>
        <li v-for="({ to, label }, i) in menus" :key="i">
          <NuxtLink :to>{{ label }}</NuxtLink>
        </li>
      </ul>
    </nav>
    <div :class="$style.copy">
      <p>&copy; {{ copyright }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  copyright: string
}>()
const menus = routeRecords([
  { to: { name: 'index-policy' }, label: 'サイトポリシー' },
  { to: { name: 'index-contact' }, label: 'お問い合わせ' },
])
</script>

<style lang="scss" module>
.footer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100px;
  padding-top: 10px;
  background: var(--page-footer-background);

  @media print {
    display: none;
  }

  & > nav {
    & > ul {
      display: flex;
      justify-content: center;
      list-style: none;

      & > li {
        padding: 0 10px;

        a {
          color: var(--color-6);
          text-decoration: none;
          cursor: pointer;

          &:hover,
          &:focus {
            color: var(--color-9);
          }
        }
      }
    }
  }
}

.copy {
  flex: 1;
  width: 100%;
  padding-top: 10px;
  color: var(--color-6);
  text-align: center;
}
</style>
