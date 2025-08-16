<template>
  <div>
    <PartsSection
      :class="$style['page-header']"
      :aria-labelledby="`title-${uid}`"
    >
      <header>
        <h2 :id="`title-${uid}`">
          {{ corporation?.name }}の路線いちらん
        </h2>
      </header>
      <p>
        {{ corporation?.name }}の路線いちらんです。<br />
        問題の No.
        が表示されている路線はクリックするとタイピングの問題を表示します。
      </p>
      <footer>
        <button v-show="navigator.enable" @click="navigator.backOrIndex">
          もどる
        </button>
      </footer>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
    <ol
      class="row"
      :class="$style.lists"
      :aria-label="`${corporation?.name}の路線いちらん`"
    >
      <li
        v-for="({ id, name, yomi }, i) in corporation.operationLines"
        :key="i"
        class="col-s-12 col-m-6 col-4"
        :aria-label="name"
      >
        <NuxtLink
          :to="id ? { name: 'index-problems-id', params: { id } } : undefined"
          :title="id ? `${name}の駅いちらんのタイピング問題を表示` : undefined"
        >
          <span v-if="id" :class="$style.code">No.{{ id }}</span>
          <span v-else :class="$style.code">(問題未作成)</span>
          <span :class="$style.yomi">{{ yomi }}</span>
          <div>{{ name }}</div>
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
const { wrapLoading } = useLoading()

const route = useRoute('index-railway-corporations-code')
const navigator = useNavigator()
const { retrieveCorporation } = useRailways()

const uid = useId()
const corporation = await wrapLoading(
  retrieveCorporation({ code: route.params.code }),
)

useHead({
  title: `${corporation.name}の路線いちらん`,
})
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.page-header {
  @include cmps.pageHeader;
}

.lists {
  @include cmps.listCard;

  & a:not([href]) * {
    color: var(--color-9);
  }
}

.code {
  font-size: 0.8rem;
}

.yomi {
  font-size: 0.7rem;
  color: var(--color-3);
}
</style>
