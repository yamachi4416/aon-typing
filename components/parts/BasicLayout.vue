<template>
  <div class="default">
    <section>
      <header></header>
      <main>
        <slot />
      </main>
      <footer>
        <div>
          <small class="copylight">&copy; 2021 Studio AON</small>
        </div>
      </footer>
    </section>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.default {
  width: 100%;
  height: 100%;

  & > section {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;

    & > header {
      position: relative;
      height: 30px;
      width: 100%;
    }

    & > main {
      height: calc(100% - 70px);
      position: relative;
      width: 100%;
    }

    & > footer {
      position: relative;
      height: 40px;
      width: 100%;
      text-align: center;

      .copylight {
        color: #333;
        font-size: 1.1em;
      }
    }
  }
}
</style>
