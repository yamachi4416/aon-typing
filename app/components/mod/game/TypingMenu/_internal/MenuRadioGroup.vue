<template>
  <tr>
    <th>{{ label }}</th>
    <td role="radiogroup">
      <label
        v-for="option in options"
        :key="String(option.value)"
        :title="option.title"
      >
        <input
          v-model="model"
          type="radio"
          :value="option.value"
        />
        {{ option.label }}
      </label>
    </td>
  </tr>
</template>

<script setup lang="ts" generic="T">
const { label: name, items } = defineProps<{
  label: string
  items: ReadonlyArray<readonly [value: T, label: string]>
}>()

const model = defineModel<T>({ required: true })

const options = computed(() => items.map(([value, label]) => ({
  value,
  label,
  title: `${name}を「${label}」に設定する`,
})))
</script>
