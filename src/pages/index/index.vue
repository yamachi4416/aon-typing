<template>
  <div>
    <PartsSection class="index-page-hello">
      <h2>ようこそ「あぉ～ん タイピング」へ</h2>
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

    <PartsSection class="index-page-search">
      <h2>タイトル検索</h2>
      <p>タイピングの問題のタイトルをキーワードで検索します。</p>
      <div class="index-page-search-form">
        <div class="index-page-search-form-search row">
          <div
            class="index-page-search-form-search-keyword row form-group placeholder"
          >
            <input
              id="search-keyword"
              v-model="state.kwd"
              placeholder=" "
              @keyup.enter="searchEnterProblems"
              @change="changeKwds"
            />
            <label for="search-keyword">検索キーワード</label>
          </div>
          <div class="buttons">
            <span>
              <button
                class="button big"
                :disabled="!enableSearch"
                @click="searchProblems"
              >
                検索する
              </button>
            </span>
          </div>
        </div>
      </div>
      <template #left>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>

    <section class="index-page-newProblems">
      <div class="index-page-newProblems-inner">
        <h2>新着の問題</h2>
        <div>
          <ModProblemLists
            :problems="newProblems"
            @tag="$navigator.indexTagDetail"
            @detail="$navigator.indexProblemDetail"
            @play="$navigator.gameMenu"
          />
          <div class="index-page-newProblems-more">
            <NuxtLink :to="{ name: 'index-problems-news' }">
              新着の問題をもっと見る
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <PartsSection class="index-page-tags">
      <h2>タグいちらん</h2>
      <div class="buttons index-page-tags-list">
        <span v-for="tag in tagSummary" :key="`tag-${tag.id}`">
          <NuxtLink
            :to="{ name: 'index-problems-tags-id', params: { id: tag.id } }"
            class="index-page-tags-list-item button"
          >
            <span class="tag-item">
              <span class="tag-item-name">{{ tag.name }}</span>
              <span class="tag-item-count">
                <span class="tag-item-count-number">{{ tag.count }}</span>
              </span>
            </span>
          </NuxtLink>
        </span>
      </div>
      <template #right>
        <ImgNekoUserKeyboard />
      </template>
    </PartsSection>

    <PartsSection class="index-page-others">
      <h2>その他</h2>
      <nav class="others-contents">
        <ul class="others-contents-list">
          <li class="others-contents-list-item">
            <NuxtLink :to="{ name: 'index-contents-keymap' }" class="button">
              ローマ字タイピング入力表
            </NuxtLink>
          </li>
        </ul>
      </nav>
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

const newProblems = computed(() => useProblems().newProblems)
const tagSummary = computed(() => useProblems().tagSummary)

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
    await useRouter().push({
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
</script>

<style lang="scss" scoped>
@import '~/assets/css/vars';

.index-page {
  &-tags {
    &-list {
      justify-content: flex-start;
      padding: 10px;

      &-item {
        display: block;
        padding: 5px 10px;
        color: #fff;
        text-decoration: none;
        background: rgb(255 153 0 / 100%);
        border: none;
        border-radius: 15px;

        .tag-item {
          display: flex;
          align-items: center;

          &-count {
            margin-left: 5px;

            &-number {
              display: inline-flex;
              padding: 0 8px;
              line-height: 1;
              color: #f90;
              background: #fff;
              border-radius: 15px;
            }
          }

          &::before {
            display: block;
            width: 8px;
            height: 8px;
            margin-right: 5px;
            content: '';
            background: #fff;
            border-radius: 100%;
          }
        }
      }
    }
  }

  &-search {
    &-form {
      display: flex;
      flex-wrap: wrap;
      padding: 10px;

      &-search {
        flex: 1;

        &-keyword {
          padding-right: 3px;
        }
      }
    }
  }

  &-newProblems {
    padding: 10px;
    @include __media_s {
      padding: 5px 7px;
    }

    &-inner {
      background: rgb(255 255 255 / 90%);
      border-radius: 20px;
      box-shadow: rgb(0 0 0 / 15%) 0 1px 3px 0;

      & > h2 {
        padding: 20px;
        padding-bottom: 5px;
        color: #666;
      }
    }

    &-more {
      display: flex;
      justify-content: flex-end;
      padding: 10px 20px 20px;

      @include __media_s {
        padding: 10px 20px 15px;
      }

      a {
        color: #666;
        text-decoration: none;
        cursor: pointer;

        &:hover {
          color: rgb(255 145 0 / 100%);
        }
      }
    }
  }

  &-others {
    .others-contents {
      &-list {
        display: flex;
        padding: 15px 10px;
        list-style: none;

        &-item {
          a {
            display: flex;
            align-items: center;
            padding: 5px 15px;
            font-size: 1em;
            color: #f90;
            text-decoration: none;
            background: #fff;
            border: 1.5px solid #f90;
            border-radius: 20px;

            &::before {
              display: block;
              width: 8px;
              height: 8px;
              margin-right: 8px;
              content: '';
              background: #f90;
              border-radius: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
