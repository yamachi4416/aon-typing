import type { ProblemItemTag } from '~~/types/problems'

function toSpreadValues<T extends object>(ref: Ref<T>) {
  return Object.fromEntries(
    (Object.keys(ref.value) as (keyof T)[]).map((key) => [
      key,
      computed({
        get: () => ref.value[key],
        set: (value) => {
          ref.value[key] = value
        },
      })]),
  ) as { [K in keyof T]: WritableComputedRef<T[K]> }
}

function initialListStateValue() {
  return {
    page: 1,
    tags: new Map<string, ProblemItemTag>(),
  }
}

export function useGameMenuState() {
  const listState = useState(initialListStateValue)

  function reset() {
    listState.value = initialListStateValue()
  }

  return {
    list: toSpreadValues(listState),
    reset,
  }
}
