type Handler = () => unknown

export abstract class AbortManager {
  abstract get isAborted(): boolean
  abstract abort(): this
  abstract throwIfAborted(): this
  abstract reset(): this
  abstract addListener(handler: Handler): this
  abstract removeListener(handler: Handler): this

  static create(...handlers: Handler[]): AbortManager {
    const abort = new AbortManagerImpl()
    for (const handler of handlers) {
      abort.addListener(handler)
    }
    return abort
  }

  static createAbortError(): Error {
    return new DOMException('This operation was aborted', 'AbortError')
  }
}

class AbortManagerImpl implements AbortManager {
  public isAborted: boolean = false
  private readonly handlers: Handler[] = []

  abort() {
    if (this.isAborted) return this
    this.isAborted = true
    this.handlers.forEach((handler) => handler())
    return this
  }

  throwIfAborted() {
    if (this.isAborted) {
      throw AbortManager.createAbortError()
    }
    return this
  }

  reset() {
    this.isAborted = false
    this.handlers.splice(0)
    return this
  }

  addListener(handler: Handler) {
    if (this.handlers.indexOf(handler) === -1) {
      this.handlers.push(handler)
    }
    return this
  }

  removeListener(handler: Handler) {
    const index = this.handlers.indexOf(handler)
    if (index !== -1) {
      this.handlers.splice(index, 1)
    }
    return this
  }
}
