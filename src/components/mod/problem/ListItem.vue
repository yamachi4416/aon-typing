<template>
  <article :class="$style.item" :aria-labelledby="`item-title-${uid}`">
    <div>
      <header>
        <span>No.{{ item.id }}</span>
        <h1 :id="`item-title-${uid}`">{{ item.title }}</h1>
      </header>
      <div>
        <table>
          <tbody>
            <tr>
              <th>問題数</th>
              <td>{{ item.words }}</td>
            </tr>
            <tr>
              <th>タイピング数</th>
              <td>{{ item.chars }}</td>
            </tr>
          </tbody>
        </table>
        <ModProblemTags
          :class="$style.tags"
          :tags="item.tags"
          @tag="(tag) => $emit('tag', tag)"
        />
      </div>
      <footer v-if="$slots.footer">
        <slot name="footer" />
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ProblemItemTag, ProblemListItem } from '~~/types/problems'

defineProps<{
  item: ProblemListItem
}>()

defineEmits<{
  (e: 'tag', tag: ProblemItemTag): any
}>()

const uid = getCurrentInstance()?.uid
</script>

<style lang="scss" module>
@use '~/assets/css/cmps';

.item {
  display: flex;
  flex-direction: column;

  @include cmps.card;

  & > div {
    @include cmps.paper;

    & > header {
      display: flex;
      flex-direction: column;
      color: var(--color-6);

      & > span {
        position: absolute;
        top: 8px;
        left: 20px;
        font-size: 0.8em;
        text-align: left;
      }

      h1 {
        font-size: 1em;
        font-weight: normal;
        text-align: center;
      }
    }

    & > div {
      flex-grow: 1;
      border-top: 1px solid var(--color-9);

      table {
        padding: 5px;

        td {
          text-align: right;
        }
      }
    }

    & > footer {
      @include cmps.buttons;
    }
  }
}

.tags {
  padding: 5px 10px 15px !important;
  font-size: 0.9em;
}
</style>
