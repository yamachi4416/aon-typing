<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const { maxlength } = defineProps<{
  label?: string
  maxlength?: number
}>()

const emit = defineEmits<{
  search: []
}>()

const inputRef = useTemplateRef('inputRef')

const modelValue = defineModel<string>({
  default: () => '',
})

const uid = useId()
const disabled = computed(() => !modelValue.value)

function onInput() {
  const input = inputRef.value
  if (!input || !maxlength) return
  input.value = [...input.value].slice(0, maxlength).join('')
  if (modelValue.value !== input.value) {
    modelValue.value = input.value
  }
}

function onFocusout() {
  const input = inputRef.value
  if (!input) return
  input.value = modelValue.value
}

function onSearch() {
  if (disabled.value) return
  emit('search')
}
</script>

<template>
  <form role="search" :class="$style.search" @submit.prevent>
    <div>
      <input
        :id="uid"
        ref="inputRef"
        v-model="modelValue"
        placeholder=" "
        :class="$style.input"
        @input="onInput"
        @focusout="onFocusout"
        @keyup.enter="onSearch"
      />
      <label v-if="label" :for="uid">
        {{ label }}
      </label>
    </div>
    <button
      type="button"
      :class="$style.button"
      :disabled
      @click="onSearch"
    >
      検索する
    </button>
  </form>
</template>

<style lang="scss" module>
@use '~/assets/css/vars';
@use '~/assets/css/cmps';

.search {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 10px;
}

.input {
  @include cmps.placeholder;
}

.button {
  @include cmps.button-big {
    align-self: center;
  }
}
</style>
