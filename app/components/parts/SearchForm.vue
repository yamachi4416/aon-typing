<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const inputRef = useTemplateRef('inputRef')

const { maxlength } = defineProps<{
  label?: string
  maxlength?: number
}>()

const emit = defineEmits<{
  enter: []
  search: []
  change: []
}>()

const [modelValue, modifiers] = defineModel<string, 'trim' | 'lazy'>({
  default: () => '',
})

const uid = useId()
const disabled = computed(() => !modelValue.value)

function onInput() {
  const input = inputRef.value!

  if (maxlength) {
    input.value = [...input.value].slice(0, maxlength).join('')
  }

  if (modifiers.lazy) return
  modelValue.value = input.value
}

function onChange() {
  const input = inputRef.value!

  if (modifiers.trim) {
    input.value = input.value.trim()
  }

  modelValue.value = input.value
  emit('change')
}

function onEnter() {
  if (disabled.value) return
  emit('enter')
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
        v-model.lazy="modelValue"
        placeholder=" "
        :class="$style.input"
        @input="onInput"
        @change="onChange"
        @keyup.enter="onEnter"
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
