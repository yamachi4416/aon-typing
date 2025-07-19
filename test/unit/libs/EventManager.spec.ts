import { describe, expect, it, vi } from 'vitest'
import { EventManager, TypingEvent } from '~~/libs/EventManager'

describe('EventManager', () => {
  describe('add', () => {
    it('イベントの購読ができる (globalThis)', () => {
      const manager = EventManager.create()

      const event = new KeyboardEvent('keydown')
      const handler = vi.fn()

      manager.add('keydown', handler)
      manager.dispatch(event)

      expect(handler).toBeCalledTimes(1)
      expect(handler).toBeCalledWith(event)
    })

    it('イベントの購読ができる (window)', () => {
      const manager = EventManager.create()

      const handler = vi.fn()

      manager.add('click', handler, window)

      document.body.click()

      expect(handler).toBeCalledTimes(1)
    })

    it('イベントの購読ができる (Document)', () => {
      const manager = EventManager.create()

      const handler = vi.fn()

      manager.add('click', handler, document)

      document.body.click()

      expect(handler).toBeCalledTimes(1)
    })

    it('イベントの購読ができる (Element)', () => {
      const manager = EventManager.create()

      const handler = vi.fn()
      const target = document.createElement('input')
      document.body.appendChild(target)

      manager.add('click', handler, target)

      target.click()

      expect(handler).toBeCalledTimes(1)
    })

    it('イベントの購読ができる (EventTarget)', () => {
      const manager = EventManager.create()

      const handler = vi.fn()
      const target = document.body

      manager.add('click', handler, target as EventTarget)

      target.click()

      expect(handler).toBeCalledTimes(1)
    })

    it('重複して購読されない', () => {
      const manager = EventManager.create()

      const handler = vi.fn()

      manager.add('click', handler, window)
      manager.add('click', handler, window)
      manager.add('click', handler, window)

      document.body.click()

      expect(handler).toBeCalledTimes(1)
    })

    it('複数購読できる', () => {
      const manager = EventManager.create()

      const handler1 = vi.fn()
      const handler2 = vi.fn()

      const target = document.createElement('input')
      document.body.appendChild(target)

      manager.add('click', handler1, target)
      manager.add('click', handler2, target)
      manager.add('focus', handler2, target)

      target.focus()
      target.click()

      expect(handler1).toBeCalledTimes(1)
      expect(handler2).toBeCalledTimes(2)
    })
  })

  it('dispatchでイベントの発行ができる (c:typing)', () => {
    const manager = EventManager.create()

    const event = new TypingEvent({})
    const handler = vi.fn()

    manager.add('c:typing', handler)
    manager.dispatch(event)

    expect(handler).toBeCalledTimes(1)
    expect(handler).toBeCalledWith(event)
  })

  it('clearで購読したイベントをすべて解除できる', () => {
    const manager = EventManager.create()

    const handler1 = vi.fn()
    const handler2 = vi.fn()

    const target = document.createElement('input')
    document.body.appendChild(target)

    manager.add('click', handler1, target)
    manager.add('click', handler2, target)
    manager.add('focus', handler2, target)

    manager.clear()

    target.focus()
    target.click()

    expect(handler1).toBeCalledTimes(0)
    expect(handler2).toBeCalledTimes(0)
  })
})
