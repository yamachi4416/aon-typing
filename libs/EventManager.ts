export type TypingEventDetail = {
  char?: string
  shiftKey?: boolean
  capsLock?: boolean
}

export class TypingEvent extends CustomEvent<TypingEventDetail> {
  constructor(detail: TypingEventDetail) {
    super('c:typing', { detail })
  }
}

type Values<T> = T[keyof T]

interface Add<This> {
  add(name: 'c:typing', handler: (e: TypingEvent) => void): This
  add<K extends keyof GlobalEventHandlersEventMap>(
    name: K,
    handler: (e: GlobalEventHandlersEventMap[K]) => void,
    target?: typeof globalThis,
  ): This
  add<K extends keyof WindowEventHandlersEventMap>(
    name: K,
    handler: (e: WindowEventHandlersEventMap[K]) => void,
    target: Window,
  ): This
  add<K extends keyof DocumentEventMap>(
    name: K,
    handler: (e: DocumentEventMap[K]) => void,
    target: Document,
  ): This
  add<K extends keyof ElementEventMap>(
    name: K,
    handler: (e: ElementEventMap[K]) => void,
    target: Element,
  ): This
  add(name: string, handler: EventListener, target: EventTarget): This
  add(name: string, handler: EventListener, target?: EventTarget): This
}

interface Dispatch<This> {
  dispatch(event: TypingEvent): This
  dispatch(
    event: Values<GlobalEventHandlersEventMap>,
    target?: typeof globalThis,
  ): This
  dispatch(event: Values<WindowEventHandlersEventMap>, target: Window): This
  dispatch(event: Values<DocumentEventMap>, target: Document): This
  dispatch(event: Values<ElementEventMap>, target: Element): This
  dispatch(event: Event, target: EventTarget): This
}

export abstract class EventManager {
  abstract readonly add: Add<this>['add']
  abstract readonly dispatch: Dispatch<this>['dispatch']
  abstract clear(): this

  static create(): EventManager {
    return new EventManagerImpl()
  }
}

class RegisteredListener {
  constructor(
    public readonly name: string,
    public readonly handler: EventListener,
    public readonly target: EventTarget,
  ) {}

  isEqual(other: RegisteredListener) {
    return (
      other.name === this.name &&
      other.handler === this.handler &&
      other.target === this.target
    )
  }
}

class EventManagerImpl implements EventManager {
  private readonly listeners: RegisteredListener[] = []

  add(name: string, handler: EventListener, target: EventTarget = globalThis) {
    const listener = new RegisteredListener(name, handler, target)
    if (!this.listeners.some((l) => listener.isEqual(l))) {
      target.addEventListener(name, handler)
      this.listeners.push(listener)
    }
    return this
  }

  dispatch(event: Event, target: EventTarget = globalThis) {
    target.dispatchEvent(event)
    return this
  }

  clear() {
    const targets = this.listeners.splice(0)
    targets.forEach(({ name, handler, target }) =>
      target.removeEventListener(name, handler),
    )
    return this
  }
}
