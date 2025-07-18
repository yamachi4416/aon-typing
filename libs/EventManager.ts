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

type EventMap =
  | keyof WindowEventMap
  | keyof DocumentEventMap
  | keyof ElementEventMap
  | 'c:typing'

type Target<K extends EventMap> = K extends keyof WindowEventMap | 'c:typing'
  ? Window & typeof globalThis
  : K extends keyof DocumentEventMap
    ? Document
    : K extends keyof ElementEventMap
      ? Element
      : never

type Handler<K extends EventMap> = K extends 'c:typing'
  ? (e: TypingEvent) => void
  : K extends keyof WindowEventMap
    ? (e: WindowEventMap[K]) => void
    : K extends keyof DocumentEventMap
      ? (e: DocumentEventMap[K]) => void
      : K extends keyof ElementEventMap
        ? (e: ElementEventMap[K]) => void
        : EventListener

export abstract class EventManager {
  abstract add<K extends EventMap>(
    eventName: K,
    handler: Handler<K>,
    target?: Target<K>,
  ): this
  abstract dispatch(event: Event, target?: Document | Element | Window): this
  abstract clear(): this

  static create(): EventManager {
    return new EventManagerImpl()
  }
}

class EventManagerImpl implements EventManager {
  private listeners: {
    eventName: string
    handler: EventListener
    target: Document | Element | Window
  }[] = []

  add<K extends EventMap>(
    eventName: K,
    handler: Handler<K>,
    target: Target<K> = window as Target<K>,
  ) {
    target.addEventListener(eventName, handler as EventListener)
    this.listeners.push({
      eventName,
      handler: handler as EventListener,
      target,
    })
    return this
  }

  dispatch(event: Event, target: Document | Element | Window = window) {
    target.dispatchEvent(event)
    return this
  }

  clear() {
    const targets = this.listeners.splice(0)
    targets.forEach(({ eventName, handler, target }) =>
      target.removeEventListener(eventName, handler),
    )
    return this
  }
}
