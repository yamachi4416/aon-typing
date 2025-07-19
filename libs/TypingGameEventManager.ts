import {
  EventManager,
  TypingEvent,
  type TypingEventDetail,
} from './EventManager'

export abstract class TypingGameEventManager {
  abstract addKeydown(handler: (e: KeyboardEvent) => unknown): typeof handler
  abstract addTyping(handler: (e: TypingEvent) => unknown): typeof handler
  abstract addVisibilitychange(handler: () => unknown): typeof handler

  abstract dispatchTyping(detail: TypingEventDetail): unknown
  abstract clear(): unknown

  static create(eventManager = EventManager.create()): TypingGameEventManager {
    return new TypingGameEventManagerImple(eventManager)
  }
}

class TypingGameEventManagerImple implements TypingGameEventManager {
  constructor(private readonly eventManager: EventManager) {}

  addKeydown(handler: (e: KeyboardEvent) => unknown) {
    this.eventManager.add('keydown', handler)
    return handler
  }

  addTyping(handler: (e: TypingEvent) => unknown) {
    this.eventManager.add('c:typing', handler)
    return handler
  }

  addVisibilitychange(handler: () => unknown) {
    this.eventManager.add('visibilitychange', handler, document)
    return handler
  }

  dispatchTyping(detail: TypingEventDetail) {
    this.eventManager.dispatch(new TypingEvent(detail))
  }

  clear() {
    this.eventManager.clear()
  }
}
