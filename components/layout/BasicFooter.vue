<template>
  <footer class="basic-footer" :class="{ 'hide-footer': hideFooter }">
    <nav class="basic-footer-nav">
      <ul>
        <li v-for="(menu, i) in menus" :key="`footer-menu-${i}`">
          <nuxt-link
            v-if="$route.name !== menu.route.name"
            :to="menu.route"
            v-text="menu.label"
          />
          <a v-else @click="scrollTop(menu.route)" v-text="menu.label" />
        </li>
      </ul>
    </nav>
    <div class="basic-footer-copy">
      <p>&copy; 2021 Studio AON</p>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'
import PageBaseMixin from '~/mixins/PageBaseMixin'

export default {
  mixins: [PageBaseMixin],
  props: {
    menus: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters('uiStatus', ['hideFooter']),
  },
}
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
