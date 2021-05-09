<template>
  <basic-layout>
    <div class="top-page-wrapper">
      <svg
        class="top-page"
        viewBox="0 0 1133 764"
        xmlns="http://www.w3.org/2000/svg"
      >
        <foreignObject class="top-page-content" width="100%" height="100%">
          <section>
            <header>
              <h1 class="title">あぉ～んタピンング</h1>
            </header>
            <main class="top-page-main">
              <div class="top-page-main-left"></div>
              <div class="top-page-main-play">
                <button class="button" @click="$router.push({ name: 'game' })">
                  タイピングをする
                </button>
              </div>
              <div class="top-page-main-info">
                <button class="button">このサイトについて</button>
              </div>
              <div class="top-page-main-right"></div>
            </main>
          </section>
        </foreignObject>
      </svg>
    </div>
  </basic-layout>
</template>

<script>
import BasicLayout from '~/components/parts/BasicLayout.vue'
export default {
  components: { BasicLayout },
}
</script>

<style lang="scss" scoped>
.top-page-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;

  .top-page {
    max-width: 100%;
    max-height: 100%;

    section {
      position: absolute;
      top: 10px;
      right: 10px;
      bottom: 10px;
      left: 10px;
      background: #fff;
      border-radius: 20px;
      border: 3px solid #333;
    }

    header {
      .title {
        display: flex;
        padding: 0;
        margin: 0;
        position: absolute;
        left: 8.21%;
        right: 21.55%;
        top: 9.29%;
        bottom: 50%;
        text-indent: -9999px;

        background: url(~/static/img/top/title.svg);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }

    &-main {
      &-left {
        left: 8.21%;
        right: 76.79%;
        top: 67.27%;
        bottom: 10.48%;
        background: url(~/static/img/top/left.png);
      }

      &-right {
        left: 75.01%;
        right: 3.37%;
        top: 55.64%;
        bottom: 12.36%;

        background: url(~/static/img/top/right.png);
        transform: matrix(0.99, 0.18, -0.16, 0.98, 0, 0);
      }

      &-left,
      &-right {
        position: absolute;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        filter: grayscale(80%);
      }

      .button {
        height: 100%;
        width: 100%;
        border-radius: 20px;
        font-size: 30px;
        border-width: 3px;
      }

      &-play {
        position: absolute;
        left: 32.41%;
        right: 32.38%;
        top: 67.27%;
        bottom: 24.36%;
      }

      &-info {
        position: absolute;
        left: 32.41%;
        right: 32.41%;
        top: 81.18%;
        bottom: 10.43%;

        .button {
          background: transparent;
        }
      }
    }
  }
}
</style>
