<template>
  <div>
    <label class="col-3 col-sm-12" :for="id">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <span>
      <slot :attrs />
      <span
        :id="errorId"
        :class="$style.error"
        role="alert"
        :aria-hidden="!error"
        v-text="error"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const {
  label = '',
  error = '',
} = defineProps<{
  label?: string
  error?: string
}>()

const id = useId()
const errorId = `error-${id}`
const attrs = computed<HTMLAttributes>(() => ({
  id,
  'aria-invalid': !!error,
  'aria-errormessage': errorId,
}))
</script>

<style lang="scss" module>
.error {
  display: block;
  padding-top: 3px;
  font-size: 0.9em;
  color: var(--input-error-message);

  &[aria-hidden='true'] {
    display: none;
  }
}
</style>
