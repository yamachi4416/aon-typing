export function toReactive<T extends object>(
  ref: Ref<T extends readonly unknown[] ? never : T>,
) {
  const proxy = new Proxy({} as T, {
    get(_, p, receiver) {
      if (ref.value == null) return undefined
      return Reflect.get(ref.value, p, receiver)
    },
    set(_, p, newValue) {
      if (ref.value == null) return true
      return Reflect.set(ref.value, p, newValue)
    },
    has(_, p) {
      if (ref.value == null) return false
      return Reflect.has(ref.value, p)
    },
    ownKeys(_) {
      if (ref.value == null) return []
      return Reflect.ownKeys(ref.value)
    },
    getOwnPropertyDescriptor(_, p) {
      if (ref.value == null) return undefined
      return Reflect.getOwnPropertyDescriptor(ref.value, p)
    },
    getPrototypeOf(_) {
      if (ref.value == null) return null
      return Reflect.getPrototypeOf(ref.value)
    },
    deleteProperty(_, p) {
      if (ref.value == null) return true
      return Reflect.deleteProperty(ref.value, p)
    },
    setPrototypeOf(_, v) {
      if (ref.value == null) return true
      return Reflect.setPrototypeOf(ref.value, v)
    },
  })

  return reactive<T>(proxy)
}
