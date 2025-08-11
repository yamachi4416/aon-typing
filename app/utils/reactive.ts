export function toReactive<T extends object>(ref: Ref<T>) {
  const proxy = new Proxy({} as T, {
    get(_, p) {
      return Reflect.get(ref.value, p)
    },
    set(_, p, newValue) {
      return Reflect.set(ref.value, p, newValue)
    },
    has(_, p) {
      return Reflect.has(ref.value, p)
    },
    ownKeys(_) {
      return Reflect.ownKeys(ref.value)
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true,
      }
    },
  })

  return reactive(proxy)
}
