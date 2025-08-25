export function usePageQuery(
  route: Parameters<typeof useURLQuery>[0],
  options: Parameters<typeof useURLQuery>[4] = { replace: false },
) {
  return useURLQuery(route, 'page', 'positiveInt', 1, options)
}
