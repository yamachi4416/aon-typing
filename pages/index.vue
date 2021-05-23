<template>
  <section class="basic-page">
    <basic-header title-text="あぉ～ん タイピング" :show-anim="true">
      <div class="basic-page-menu">
        <nav class="basic-page-menu-content">
          <ul>
            <li v-for="(menu, i) in menus" :key="`menu-${i}`">
              <nuxt-link
                v-if="$route.name !== menu.route.name"
                :to="menu.route"
                v-text="menu.label"
              />
              <a v-else @click="scrollTop(menu.route)" v-text="menu.label" />
            </li>
          </ul>
        </nav>
      </div>
    </basic-header>
    <main class="basic-page-main">
      <nuxt-child />
    </main>
    <footer class="basic-page-footer">
      <nav class="basic-page-footer-nav">
        <ul>
          <li>
            <nuxt-link :to="{ name: 'index-disclaimer' }">免責事項</nuxt-link>
          </li>
          <li>
            <nuxt-link :to="{ name: 'index-policy' }">
              プライバシーポリシー
            </nuxt-link>
          </li>
        </ul>
      </nav>
      <div class="basic-page-footer-copy">
        <p>&copy; 2021 Studio AON</p>
      </div>
    </footer>
  </section>
</template>

<script>
import BasicHeader from '~/components/layout/BasicHeader.vue'
export default {
  components: { BasicHeader },
  data() {
    return {
      menus: [
        { route: { name: 'game' }, label: 'プレイする' },
        { route: { name: 'index-problems' }, label: '問題いちらん' },
        { route: { name: 'index-about' }, label: 'サイト説明' },
        { route: { name: 'index' }, label: 'その他' },
      ],
    }
  },
  methods: {
    async scrollTop(query) {
      if (Object.keys(this.$route.query).length) {
        this.$router.push(query)
        await this.$nextTick()
      }
      document.scrollingElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.basic-page {
  min-height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  background-repeat: repeat-x;
  background-size: auto 100%;
  background-position: center;
  background-attachment: fixed;
  background-image: url(~/static/img/back01.png);

  &-menu {
    margin-top: -45px;
    &-content {
      width: 100%;
      max-width: 1000px;
      margin: 0 auto;

      ul {
        display: flex;
        justify-content: space-around;
        list-style: none;
        padding: 10px;
        gap: 10px;
        width: 100%;

        & > li {
          flex: 1;
          text-align: center;

          a {
            cursor: pointer;
            color: #666;
            text-decoration: none;
            white-space: nowrap;

            &:hover,
            &:focus {
              color: #999;
            }
          }
        }
      }
    }
  }

  &-main {
    padding: 10px;
    max-width: 1000px;
    margin: 0 auto;
    min-height: calc(100vh - 200px);
  }

  &-footer {
    height: 100px;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.8);
    // box-shadow: rgba(0, 0, 0, 0.15) 0 1px 3px 0;
    padding-top: 10px;

    &-nav {
      & > ul {
        display: flex;
        list-style: none;
        justify-content: center;
        gap: 30px;

        & > li {
          a {
            color: #666;
            text-decoration: none;
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

  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.3s;
  }
  .page-enter,
  .page-leave-to {
    opacity: 0;
  }
}
</style>

<style lang="scss">
.basic-page-main {
  * {
    scroll-margin-top: 100px;
  }
}
</style>
