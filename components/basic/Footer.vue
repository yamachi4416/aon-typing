<template>
  <footer class="basic-footer">
    <nav class="basic-footer-nav">
      <ul>
        <li v-for="(menu, i) in menus" :key="`footer-menu-${i}`">
          <NuxtLink :to="menu.route">{{ menu.label }}</NuxtLink>
        </li>
      </ul>
    </nav>
    <div class="basic-footer-copy">
      <p>&copy; 2021 Studio AON</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const menus = [
  { route: { name: "index-policy" }, label: "サイトポリシー" },
  { route: { name: "index-contact" }, label: "お問い合わせ" },
];
</script>

<style lang="scss" scoped>
.basic-footer {
  height: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
  padding-top: 10px;

  @media print {
    display: none;
  }

  &.hide-footer {
    visibility: hidden;
  }

  &-nav {
    & > ul {
      display: flex;
      list-style: none;
      justify-content: center;

      & > li {
        padding: 0 10px;
        a {
          cursor: pointer;
          color: #666;
          text-decoration: none;
          &:hover,
          &:focus {
            color: #999;
          }
        }
      }
    }
  }

  &-copy {
    color: #666;
    width: 100%;
    text-align: center;
    flex: 1;
    padding-top: 10px;
  }
}
</style>
