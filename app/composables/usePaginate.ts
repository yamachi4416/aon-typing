import { paginate } from '~~/libs/Util'

export function usePaginate<T>(
  items: MaybeRefOrGetter<ReadonlyArray<T>>,
  page: Ref<number>,
  pageSize?: MaybeRefOrGetter<number | undefined>,
) {
  const pages = computed(() =>
    paginate({
      items: toValue(items),
      page: page.value,
      pageSize: toValue(pageSize) ?? 30,
    }),
  )

  watch(
    () => pages.value.last,
    (last) => {
      if (page.value > last) {
        page.value = last || 1
      }
    },
    {
      immediate: true,
    },
  )

  return pages
}
