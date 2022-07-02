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
              placeholder=" "
              v-model="state.kwd"
              @keyup.enter="searchEnterProblems"
              @change="changeKwds"
            />
            <label for="search-keyword">検索キーワード</label>
          </div>
          <div class="buttons">
            <span>
              <button
                class="button big"
                :disabled="!enableSearch || null"
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
            <NuxtLink :to="{ name: 'index-contents-keymap' }" class="button"
              >ローマ字タイピング入力表</NuxtLink
            >
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
  title: "トップページ",
});

const newProblems = computed(() => useProblems().newProblems);
const tagSummary = computed(() => useProblems().tagSummary);

const state = reactive({
  kwd: "",
});

const enableSearch = computed(() => !!normalizedKwd(state.kwd));

onMounted(() => {
  state.kwd = normalizedKwd((useRoute().query.kwd as string) ?? "");
});

function normalizedKwd(val: string) {
  const kwd = val ? Array.from(val).slice(0, 100).join("") : "";
  return kwd.trim();
}

async function searchProblems() {
  if (enableSearch.value) {
    await useRouter().push({
      name: "index-problems",
      query: { kwd: normalizedKwd(state.kwd) },
    });
  }
}

async function searchEnterProblems() {
  if (enableSearch.value) {
    changeKwds();
    await searchProblems();
  }
}

function changeKwds() {
  const kwd = normalizedKwd(state.kwd);
  if (kwd !== (useRoute().query.kwd ?? "")) {
    useNavigator().replaceQuery({ kwd });
  }
}
</script>

<style lang="scss" scoped>
@import "~/assets/css/vars.scss";

.index-page {
  &-tags {
    &-list {
      justify-content: flex-start;
      padding: 10px;
      &-item {
        text-decoration: none;
        padding: 5px 10px;
        background: rgba(255, 153, 0, 1);
        color: #fff;
        border: none;
        border-radius: 15px;
        display: block;

        .tag-item {
          display: flex;
          align-items: center;

          &-count {
            margin-left: 5px;
            &-number {
              background: #fff;
              color: #ff9900;
              display: inline-flex;
              line-height: 1;
              border-radius: 15px;
              padding: 0 8px;
            }
          }

          &::before {
            content: "";
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 100%;
            background: #fff;
            margin-right: 5px;
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
      background: rgba(255, 255, 255, 0.9);
      box-shadow: rgba(0, 0, 0, 0.15) 0 1px 3px 0;
      border-radius: 20px;
      & > h2 {
        color: #666;
        padding: 20px;
        padding-bottom: 5px;
      }
    }
  }

  &-others {
    .others-contents {
      &-list {
        list-style: none;
        padding: 15px 10px;
        display: flex;
        &-item {
          a {
            display: flex;
            align-items: center;
            font-size: 1em;
            padding: 5px 15px;
            border: 1.5px solid #ff9900;
            border-radius: 20px;
            text-decoration: none;
            color: #ff9900;
            background: #fff;

            &::before {
              content: "";
              display: block;
              width: 8px;
              height: 8px;
              border-radius: 100%;
              background: #ff9900;
              margin-right: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
