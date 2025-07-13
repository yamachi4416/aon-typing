type Handler = () => unknown

export abstract class AbortManager {
  abstract get isAborted(): boolean
  abstract abort(): void
  abstract throwIfAborted(): void
  abstract reset(): void
  abstract addListener(handler: Handler): AbortManager
  abstract removeListener(handler: Handler): AbortManager

  static create(): AbortManager {
    return new AbortManagerImpl()
  }

  static createAbortError(): Error {
    return new DOMException('This operation was aborted', 'AbortError')
  }
}

class AbortManagerImpl implements AbortManager {
  public get isAborted() {
    return this.controller.signal.aborted
  }

  private controller: AbortController
  private readonly handlers: Handler[]

  constructor() {
    this.controller = new AbortController()
    this.handlers = []
  }

  abort(): void {
    this.controller.abort()
  }

  throwIfAborted(): void {
    if (this.controller.signal.aborted) {
      throw AbortManager.createAbortError()
    }
  }

  reset(): void {
    for (const handler of this.handlers.splice(0)) {
      this.controller.signal.removeEventListener('abort', handler)
    }
    this.controller = new AbortController()
  }

  addListener(handler: Handler) {
    if (this.handlers.indexOf(handler) === -1) {
      this.handlers.push(handler)
      this.controller.signal.addEventListener('abort', handler)
    }
    return this
  }

  removeListener(handler: Handler) {
    const index = this.handlers.indexOf(handler)
    if (index !== -1) {
      this.handlers.splice(index, 1)
      this.controller.signal.removeEventListener('abort', handler)
    }
    return this
  }
}
