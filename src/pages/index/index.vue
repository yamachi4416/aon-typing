<template>
  <div>
    <PartsSection aria-labelledby="hello-title">
      <h2 id="hello-title">ようこそ「あぉ～ん タイピング」へ</h2>
      <p>
        あぉ～ん
        タイピングはインターネット上でタイピングの練習ができる無料のタイピング練習サイトです。
        パソコンを使いはじめた初心者さんや、タイピングがもっと早くなりたい中級者さんにおすすめです。
        たのしくタイピングを練習しましょう。
      </p>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>

    <PartsSection :class="$style.search" aria-labelledby="search-title">
      <h2 id="search-title">タイトル検索</h2>
      <p>タイピングの問題のタイトルをキーワードで検索します。</p>
      <form role="search" @submit.prevent>
        <div>
          <input
            id="search-keyword"
            v-model="state.kwd"
            placeholder=" "
            @keyup.enter="searchEnterProblems"
            @change="changeKwds"
          />
          <label for="search-keyword">検索キーワード</label>
        </div>
        <button :disabled="!enableSearch" @click="searchProblems">
          検索する
        </button>
      </form>
      <template #left>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>

    <section :class="$style.news" aria-labelledby="news-title">
      <h2 id="news-title">新着の問題</h2>
      <ModProblemLists
        :problems="newProblems"
        @tag="$navigator.indexTagDetail"
        @detail="$navigator.indexProblemDetail"
        @play="$navigator.gameMenu"
      />
      <footer>
        <NuxtLink :to="{ name: 'index-problems-news' }">
          新着の問題をもっと見る
        </NuxtLink>
      </footer>
    </section>

    <PartsSection :class="$style.tags" aria-labelledby="tags-title">
      <h2 id="tags-title">タグいちらん</h2>
      <ul>
        <li v-for="tag in tagSummary" :key="`tag-${tag.id}`">
          <NuxtLink
            :to="{ name: 'index-problems-tags-id', params: { id: tag.id } }"
          >
            <span>{{ tag.name }}</span>
            <span :class="$style.count">
              <span>(</span>
              <span>{{ tag.count }}</span>
              <span>)</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>

    <PartsSection :class="$style.others" aria-labelledby="others-title">
      <h2 id="others-title">その他</h2>
      <ul>
        <li>
          <NuxtLink :to="{ name: 'index-contents-keymap' }">
            ローマ字タイピング入力表
          </NuxtLink>
        </li>
      </ul>
      <template #left>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'トップページ',
})

const { newProblems, tagSummary, fetchTopNewsProblems, fetchTags } =
  useProblems()

const state = reactive({
  kwd: '',
})

const enableSearch = computed(() => !!normalizedKwd(state.kwd))

onMounted(() => {
  state.kwd = normalizedKwd((useRoute().query.kwd as string) ?? '')
})

function normalizedKwd(val: string) {
  const kwd = val ? Array.from(val).slice(0, 100).join('') : ''
  return kwd.trim()
}

async function searchProblems() {
  if (enableSearch.value) {
    await navigateTo({
      name: 'index-problems',
      query: { kwd: normalizedKwd(state.kwd) },
    })
  }
}

async function searchEnterProblems() {
  if (enableSearch.value) {
    changeKwds()
    await searchProblems()
  }
}

function changeKwds() {
  const kwd = normalizedKwd(state.kwd)
  if (kwd !== (useRoute().query.kwd ?? '')) {
    useNavigator().replaceQuery({ kwd })
  }
}

await Promise.all([fetchTopNewsProblems(), fetchTags()])
</script>

<style lang="scss" module>
@use '~/assets/css/vars';
@use '~/assets/css/cmps';

@mixin tag-clound($color) {
  ul {
    @include cmps.buttons;

    justify-content: flex-start;
    padding: 10px;
    list-style: none;

    a {
      display: flex;
      gap: 5px;
      align-items: center;
      padding: 5px 15px;
      color: $color;
      text-decoration: none;
      @content;

      &::before {
        display: block;
        width: 8px;
        height: 8px;
        content: '';
        background: $color;
        border-radius: 100%;
      }
    }
  }
}

.tags {
  @include tag-clound($color: var(--color-f)) {
    background: var(--color-p);
    border: none;
    border-radius: 15px;
  }
}

.count {
  display: flex;
  gap: 2px;
  align-items: center;
  font-size: 0.9em;
}

.search {
  form {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding: 10px;

    input {
      @include cmps.placeholder;
    }

    button {
      @include cmps.button-big;

      align-self: center;
    }
  }
}

.news {
  margin: 10px;
  background: var(--background-90);
  border-radius: 20px;
  box-shadow: var(--shadow-color-md) 0 1px 3px 0;

  @include vars.media_s {
    padding: 5px 7px;
  }

  h2 {
    padding: 20px;
    padding-bottom: 5px;
    color: var(--color-6);
  }

  footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px 20px 20px;

    @include vars.media_s {
      padding: 10px 20px 15px;
    }
  }
}

.others {
  @include tag-clound($color: var(--color-p)) {
    font-size: 1em;
    background: var(--color-f);
    border: 1.5px solid var(--color-p);
    border-radius: 20px;
  }
}
</style>
