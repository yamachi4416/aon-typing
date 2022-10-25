class ScrollQueue {
  private resolve: ((value?: any) => void) | null = null
  private promise = ref(null as Promise<any>)
  private _noScroll: boolean = false
  private readonly _waiting = computed(() => !(this.promise.value == null))

  get waiting() {
    return this._waiting.value
  }

  noScroll() {
    this.add()
    this._noScroll = true
  }

  add() {
    this.flush()
    this.promise.value = new Promise((resolve) => {
      this.resolve = resolve
    })
  }

  flush() {
    if (typeof this.resolve === 'function') {
      this.resolve()
    }
    this.resolve = null
    this.promise.value = null
  }

  async wait() {
    const ret = this._noScroll
    this._noScroll = false
    if (this.promise.value != null) {
      return await this.promise.value?.then(() => ret)
    }
    return await Promise.resolve(ret)
  }
}

const scrollWaiter = new ScrollQueue()

export function useScrollWaiter() {
  return scrollWaiter
}
