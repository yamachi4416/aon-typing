import { shuffle } from '~~/libs/Util'

export function useRandomSelect<T>(
  value: Ref<T>,
  values: MaybeRefOrGetter<ReadonlyArray<T>>,
) {
  const shuffles = shallowRef(new Set<T>())

  function updateShuffles() {
    const newValues = new Set(shuffle(toValue(values)))
    if (value.value !== undefined) {
      newValues.delete(value.value)
      newValues.add(value.value)
    }
    shuffles.value = newValues
    return shuffles.value
  }

  function getShuffles() {
    return shuffles.value.size > 0 ? shuffles.value : updateShuffles()
  }

  function select() {
    if (toValue(values).length === 0) return

    const shuffles = getShuffles()
    for (const next of shuffles) {
      if (next !== value.value) {
        shuffles.delete(next)
        value.value = next
        return next
      }
    }
  }

  watch(() => toValue(values), updateShuffles)

  return {
    select,
  }
}
