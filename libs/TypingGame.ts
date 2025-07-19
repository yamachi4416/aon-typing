import { TimerManager } from './TimerManager'
import { TypingGameEventManager } from './TypingGameEventManager'
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
    eventManager,
    timerManager,
  }: {
    state: TypingGameState
    setting: TypingGameSetting
    eventManager?: TypingGameEventManager
    timerManager?: TimerManager
  }): TypingGame {
    return new TypingGameImpl(state, setting, eventManager, timerManager)
  }
}

class TypingGameImpl implements TypingGame {
  private _stop: () => void = () => {}

  constructor(
    private readonly state: TypingGameState,
    private readonly setting: TypingGameSetting,
    private readonly eventManager = TypingGameEventManager.create(),
    private readonly timerManager = TimerManager.create(30),
  ) {}

  private _addTypingHandler({ gamer }: { gamer: TypingGamer }) {
    gamer.init(this.state.current)

    return this.eventManager.addTyping((event) => {
      const state = this.state

      if (state.pausing) return

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

      if (state.isGoalReached) {
        this._stop()
        return
      }

      if (!word?.success) return

      word.endTime = state.tick
      state.problem?.nextWord()

      if (state.current) {
        state.current.startTime = word.endTime
        gamer.init(state.current)
        return
      }

      this._stop()
    })
  }

  private _addKeydownHandler({ autoMode }: { autoMode: number }) {
    if (autoMode) return

    return this.eventManager.addKeydown((e) => {
      e.preventDefault()
      if (e.repeat) return

      const shiftKey = e.shiftKey
      const char = { Enter: '\n', Tab: '\t' }[e.key] ?? e.key ?? ''
      const capsLock = e.getModifierState?.('CapsLock')
      const detail = { char, shiftKey, capsLock }

      if (['CapsLock', 'Shift'].includes(detail.char)) {
        detail.char = ''
      }

      this.eventManager.dispatchTyping(detail)
    })
  }

  private _addVisibleChangeHandler() {
    return this.eventManager.addVisibilitychange(() =>
      document.visibilityState === 'hidden'
        ? this.timerManager.pause()
        : this.timerManager.resume(),
    )
  }

  private _info() {
    return TypingGameInfo.create(this.state)
  }

  private _addTickTimer(timeLimit: number) {
    const interval = this.timerManager.interval * 2
    this.timerManager.add({
      handler: () => {
        const state = this.state
        if (timeLimit > 0 && state.timeUse >= timeLimit) {
          this.cancel()
        } else if (state.isRunning) {
          state.tick += interval
          state.timeUse += interval
        }
      },
      interval,
    })
  }

  private _addAutoTypingTimer({
    words,
    autoMode,
  }: {
    words: ReadonlyArray<TypingGameWordData>
    autoMode: number
  }) {
    if (!autoMode) return

    const xs = Array.from(words.reduce((a, w) => a + w.wordState.remaining, ''))

    this.timerManager.add({
      handler: () => {
        if (!this.state.isRunning) return

        const char = xs.shift()
        if (char) {
          this.eventManager.dispatchTyping({ char })
        } else {
          this.timerManager.stop()
        }
      },
      interval: autoMode,
    })
  }

  private _setStopPromise() {
    const { resolve, promise } = Promise.withResolvers<TypingGameInfo>()

    this._stop = () => {
      const state = this.state

      this._stop = () => {}
      state.running = false

      if (state.current && !state.current.endTime) {
        state.current.endTime = state.tick
      }

      this.eventManager.clear()
      this.timerManager.clear()

      resolve(this._info())
    }

    return promise
  }

  async start() {
    this.cancel()

    this._stop = () => {}

    const { words, type } = this.state.problem!
    const { timeLimit, autoMode } = this.setting

    const gamer = TypingGamer.of(type)
    if (!gamer) return undefined

    const visibleChange = this._addVisibleChangeHandler()
    this._addKeydownHandler({ autoMode })
    this._addTypingHandler({ gamer })
    this._addTickTimer(timeLimit)
    this._addAutoTypingTimer({ words, autoMode })

    const promise = this._setStopPromise()

    this.timerManager.start()
    this.state.running = true
    visibleChange()

    return await promise
  }

  cancel() {
    const state = this.state
    if (state.isRunning) {
      state.canceled = true
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
