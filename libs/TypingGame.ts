import { EventManager, TypingEvent } from './EventManager'
import { TimerManager } from './TimerManager'
import { TypingGameInfo } from './TypingGameInfo'
import { TypingGamer } from './TypingGamer'
import type { TypingGameSetting } from './TypingGameSetting'
import type { TypingGameState } from './TypingGameState'
import type { TypingGameWordData } from './TypingGameWordData'

export abstract class TypingGame {
  abstract start(): Promise<TypingGameInfo | undefined>
  abstract cancel(): TypingGameInfo
  abstract pause(): boolean
  abstract resume(): boolean
  abstract toggle(): unknown
  abstract dispose(): unknown

  static create({
    state,
    setting,
    eventManager = EventManager.create(),
    timerManager = TimerManager.create(),
  }: {
    state: TypingGameState
    setting: TypingGameSetting
    eventManager?: EventManager
    timerManager?: TimerManager
  }): TypingGame {
    return new TypingGameImpl(state, setting, eventManager, timerManager)
  }
}

class TypingGameImpl implements TypingGame {
  private _stop?: () => void

  constructor(
    private readonly state: TypingGameState,
    private readonly setting: TypingGameSetting,
    private readonly eventManager: EventManager,
    private readonly timerManager: TimerManager,
  ) {}

  private _createTypingHandler({ gamer }: { gamer: TypingGamer }) {
    gamer.init(this.state.current)

    return (event: TypingEvent) => {
      const state = this.state

      if (state.pausing) {
        return
      }

      const detail = event.detail
      const char = detail.char
      const word = state.current

      if (!char) {
        state.currentTypingState = { detail, mistake: false }
        return
      }

      state.totalTypeCount += 1

      if (gamer.expect(char, word)) {
        state.currentTypingState = { detail, mistake: false }
        state.totalTypeCorrect += 1
      } else {
        state.currentTypingState = { detail, mistake: true }
        state.totalTypeMiss += 1
      }

      if (
        state.goalCharCount > 0 &&
        state.totalTypeCorrect >= state.goalCharCount &&
        this._stop
      ) {
        this._stop()
        return
      }

      if (word?.success) {
        word.endTime = state.tick
        state.problem?.nextWord()

        if (state.current) {
          state.current.startTime = word.endTime
          gamer.init(state.current)
        } else if (this._stop) {
          this._stop()
        }
      }
    }
  }

  private _createKeydownHandler() {
    return (e: KeyboardEvent) => {
      e.preventDefault()
      if (e.repeat) {
        return
      }

      const shiftKey = e.shiftKey
      const char = { Enter: '\n', Tab: '\t' }[e.key] ?? e.key ?? ''
      const capsLock = e.getModifierState?.('CapsLock')
      const detail = { char, shiftKey, capsLock }

      if (['CapsLock', 'Shift'].includes(detail.char)) {
        detail.char = ''
      }

      this.eventManager.dispatch(new TypingEvent(detail))
    }
  }

  private _createVisibleChangeHandler() {
    return () => {
      if (document.hidden) {
        this.timerManager.pause()
      } else {
        this.timerManager.resume()
      }
    }
  }

  private _info() {
    return TypingGameInfo.create(this.state)
  }

  private _addTickTimer(timeLimit: number) {
    const interval = 60
    this.timerManager.add({
      handler: () => {
        const state = this.state
        if (timeLimit > 0 && state.timeUse >= timeLimit) {
          this.cancel()
        } else if (this.state.isRunning) {
          state.tick += interval
          state.timeUse += interval
        }
      },
      interval,
    })
  }

  private _addAutoTyping({
    words,
    autoMode,
  }: {
    words: ReadonlyArray<TypingGameWordData>
    autoMode: number
  }) {
    if (!autoMode) {
      return
    }

    const xs = Array.from(words.reduce((a, w) => a + w.wordState.remaining, ''))

    this.timerManager.add({
      handler: () => {
        if (!this.state.isRunning) {
          return
        }

        const char = xs.shift()
        if (char) {
          this.eventManager.dispatch(new TypingEvent({ char }))
        } else {
          this.timerManager.stop()
        }
      },
      interval: autoMode,
    })
  }

  async start(): Promise<TypingGameInfo | undefined> {
    this.cancel()

    this._stop = undefined

    const { words, type } = this.state.problem!
    const { timeLimit, autoMode } = this.setting

    const gamer = TypingGamer.of(type)
    if (!gamer) return undefined

    const keydown = autoMode ? () => {} : this._createKeydownHandler()
    const typing = this._createTypingHandler({ gamer })
    const visibleChange = this._createVisibleChangeHandler()

    return await new Promise((resolve) => {
      this._stop = () => {
        const state = this.state

        this._stop = undefined
        state.running = false

        if (state.current && !state.current.endTime) {
          state.current.endTime = state.tick
        }

        this.eventManager.clear()
        this.timerManager.clear()

        resolve(this._info())
      }

      this.eventManager.add('keydown', keydown)
      this.eventManager.add('c:typing', typing)
      this.eventManager.add('visibilitychange', visibleChange, document)

      this._addTickTimer(timeLimit)
      this._addAutoTyping({ words, autoMode })
      this.timerManager.start()
      this.state.running = true
      visibleChange()
    })
  }

  cancel() {
    if (this._stop) {
      this.state.canceled = true
      this._stop()
    }
    this.eventManager.clear()
    this.timerManager.clear()
    return this._info()
  }

  pause() {
    const state = this.state
    if (state.isRunning) {
      state.pausing = true
      this.timerManager.pause()
      return true
    }
    return false
  }

  resume() {
    const state = this.state
    if (state.isPausing) {
      state.pausing = false
      this.timerManager.resume()
      return true
    }
    return false
  }

  toggle() {
    const state = this.state
    if (state.isRunning) {
      this.pause()
    } else if (state.isPausing) {
      this.resume()
    }
  }

  dispose() {
    this.eventManager.clear()
    this.timerManager.clear()
  }
}
