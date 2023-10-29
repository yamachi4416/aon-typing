import { type TypingGameWordData } from './TypingGameWordData'
import { type TypingProblemQuestioner } from './TypingProblemQuestioner'
import { keyCodeToChar } from './Keys'
import { TypingGameInfo } from './TypingGameInfo'
import { type TypingGamer, useTypingGamer } from './TypingGamer'
import { timerEntry, timerTicker } from './Util'

type ProblemOrder = 'first' | 'last' | 'random'

type TypingEvent = CustomEvent<{
  keyCode?: number
  shiftKey?: boolean
  char?: string
}>

declare global {
  interface WindowEventMap {
    'c:typing': TypingEvent
  }
}

export interface GameSetting {
  timeLimit: number
  autoMode: number
  problemOrder: ProblemOrder
  goalCharCount: number
  problemId: string
}

export class TypingGame {
  problem?: TypingProblemQuestioner
  tick = 0
  pausing = false
  canceled = false
  running = false
  timeLimit = 0
  timeUse = 0
  goalCharCount = 0
  totalTypeCount = 0
  totalTypeCorrect = 0
  totalTypeMiss = 0
  currentMistake = false

  private readonly eventManager
  private readonly timerManager

  private _stop?: () => void

  constructor() {
    this.eventManager = new EventManager()
    this.timerManager = new TimerManager()
    this._initData()
  }

  private _initData() {
    this.problem = undefined
    this.tick = 0
    this.pausing = false
    this.canceled = false
    this.running = false
    this.timeLimit = 0
    this.timeUse = 0
    this.goalCharCount = 0
    this.totalTypeCount = 0
    this.totalTypeCorrect = 0
    this.totalTypeMiss = 0
    this.currentMistake = false
  }

  init({
    problem,
    setting,
  }: {
    problem?: TypingProblemQuestioner
    setting?: GameSetting
  }) {
    this._initData()
    this.problem = problem
    this.timeLimit = setting?.timeLimit ?? 0
    this.timeUse = 0
    this.goalCharCount = setting?.goalCharCount ?? 0
    this._stop = undefined
  }

  get current() {
    return this.problem?.current
  }

  get totalCharCount() {
    return this.problem?.totalCharCount
  }

  private _typing({ gamer }: { gamer: TypingGamer }) {
    gamer.init(this.current)

    return (event: TypingEvent) => {
      if (this.pausing) {
        return
      }

      const detail = event.detail
      const char = detail.char ?? keyCodeToChar(detail.keyCode, detail.shiftKey)
      const word = this.current

      if (char) {
        this.totalTypeCount += 1

        if (gamer.expect(char, word)) {
          this.currentMistake = false
          this.totalTypeCorrect += 1
        } else {
          this.currentMistake = true
          this.totalTypeMiss += 1
        }

        if (this.goalCharCount > 0) {
          if (this.totalTypeCorrect >= this.goalCharCount && this._stop) {
            this._stop()
            return
          }
        }

        if (word?.success) {
          word.endTime = this.tick
          this.problem?.nextWord()

          if (this.current) {
            this.current.startTime = word.endTime
            gamer.init(this.current)
          } else if (this._stop) {
            this._stop()
          }
        }
      }
    }
  }

  private _keydown() {
    return (e: KeyboardEvent) => {
      e.preventDefault()
      const { keyCode, shiftKey } = e
      const detail = { keyCode, shiftKey, char: null }
      const event = new CustomEvent('c:typing', { detail })
      this.eventManager.dispatch(event)
    }
  }

  private visibleChange() {
    if (document.hidden) {
      this.timerManager.pause()
    } else {
      this.timerManager.resume()
    }
  }

  private addTickTimer(timeLimit: number) {
    const interval = 60
    this.timerManager.create({
      handler: () => {
        if (timeLimit > 0 && this.timeUse >= timeLimit) {
          this.cancel()
        } else if (this.isRunning) {
          this.tick += interval
          this.timeUse += interval
        }
      },
      interval,
    })
  }

  private addAutoTyping({
    words,
    autoMode,
  }: {
    words: TypingGameWordData[]
    autoMode: number
  }) {
    if (!autoMode) {
      return
    }

    const xs = Array.from(words.reduce((a, w) => a + w.wordState.remaining, ''))

    this.timerManager.create({
      handler: () => {
        if (!this.isRunning) {
          return
        }

        const char = xs.shift()
        if (char) {
          const detail = { char }
          const event = new CustomEvent('c:typing', { detail })
          this.eventManager.dispatch(event)
        } else {
          this.timerManager.stop()
        }
      },
      interval: autoMode,
    })
  }

  async start({
    problem,
    setting,
  }: {
    problem: TypingProblemQuestioner
    setting: GameSetting
  }): Promise<TypingGameInfo | undefined> {
    this.cancel()

    const { words, type } = problem ?? {}
    const { timeLimit, autoMode } = setting
    const gamer = useTypingGamer(type)

    if (!gamer) {
      return undefined
    }

    this.init({ problem, setting })

    return await new Promise((resolve) => {
      const keydown = autoMode ? () => {} : this._keydown()
      const typing = this._typing({ gamer })

      this._stop = () => {
        this._stop = undefined
        this.running = false

        if (this.current && !this.current.endTime) {
          this.current.endTime = this.tick
        }

        this.eventManager.clear()
        this.timerManager.clear()

        resolve(this.info())
      }

      this.eventManager.add('keydown', keydown as EventListener)
      this.eventManager.add('c:typing', typing as EventListener)
      this.eventManager.add(
        'visibilitychange',
        this.visibleChange.bind(this),
        document,
      )

      this.addTickTimer(timeLimit)
      this.addAutoTyping({ words, autoMode })
      this.timerManager.start()
      this.running = true
      this.visibleChange()
    })
  }

  cancel() {
    if (this._stop) {
      this.canceled = true
      this._stop()
    }
    this.eventManager.clear()
    this.timerManager.clear()
    return this.info()
  }

  pause() {
    if (this.isRunning) {
      this.pausing = true
      this.timerManager.pause()
      return true
    }
    return false
  }

  resume() {
    if (this.isPausing) {
      this.pausing = false
      this.timerManager.resume()
      return true
    }
    return false
  }

  get isPausing() {
    return this.running && this.pausing
  }

  get isRunning() {
    return this.running && !this.pausing
  }

  info() {
    return new TypingGameInfo(this)
  }

  dispose() {
    this.eventManager.clear()
    this.timerManager.clear()
  }
}

class EventManager {
  private listeners: Array<{
    eventName: string
    handler: EventListener
    target: Document | Element | Window
    active: boolean
  }> = []

  add(
    eventName: string,
    handler: EventListener,
    target?: Document | Element | Window,
  ) {
    target = target ?? window
    target.addEventListener(eventName, handler)
    this.listeners.push({
      eventName,
      handler,
      target,
      active: true,
    })
  }

  remove(
    eventName: string,
    handler: EventListener,
    target?: Document | Element | Window,
  ) {
    target = target ?? window

    const targets = this.listeners.filter((it) => {
      it.active =
        it.eventName !== eventName ||
        it.handler !== handler ||
        it.target !== target
      return !it.active
    })

    this.listeners = this.listeners.filter((it) => it.active)

    targets.forEach((it) => {
      it.target.removeEventListener(it.eventName, it.handler)
    })
  }

  dispatch(event: Event, target?: Document | Element | Window) {
    target = target ?? window
    target.dispatchEvent(event)
  }

  clear() {
    const targets = [...this.listeners]
    this.listeners = []
    targets.forEach((it) => {
      it.target.removeEventListener(it.eventName, it.handler)
    })
  }
}

class TimerManager {
  private timer = timerTicker(30)
  private timers: ReturnType<typeof timerEntry>[] = []

  create({
    handler,
    interval,
  }: {
    handler: () => void
    interval: (() => number) | number
  }) {
    this.timers.push(timerEntry(handler, interval))
  }

  async start() {
    for (const entry of this.timers) {
      entry.setup(Date.now())
    }

    for await (const time of this.timer.start()) {
      for (const entry of this.timers) {
        entry.handle(time)
      }
    }
  }

  stop() {
    this.timer.stop()
  }

  pause() {
    this.stop()
  }

  resume() {
    this.start()
  }

  clear() {
    this.timer.stop()
    this.timers = []
  }
}
