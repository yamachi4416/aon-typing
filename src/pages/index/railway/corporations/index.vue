<template>
  <div>
    <PartsSection
      :aria-labelledby="`title-${uid}`"
      :class="$style['page-header']"
    >
      <header>
        <h2 :id="`title-${uid}`">鉄道の会社いちらん</h2>
      </header>
      <p>
        鉄道の会社いちらんです。<br />
        クリックするとその会社の路線のいちらんを表示します。
      </p>
      <footer>
        <button v-show="$navigator.enable" @click="$navigator.backOrIndex">
          もどる
        </button>
      </footer>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <ol class="row" :class="$style.lists" aria-label="鉄道会社いちらん">
      <li
        v-for="(c, i) in corporations"
        :key="i"
        class="col-s-12 col-m-6 col-4"
      >
        <NuxtLink
          :to="{
            name: 'index-railway-corporations-code',
            params: { code: c.code },
          }"
          :title="`${c.name}の路線のいちらん`"
        >
          <div>{{ c.name }}</div>
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
const uid = useId()
const { corporations } = useRailways()

useHead({
  title: '鉄道の会社いちらん',
})
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.page-header {
  @include cmps.pageHeader;
}

.lists {
  @include cmps.listCard;
}
</style>
