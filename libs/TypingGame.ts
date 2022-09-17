import { TypingGameWordData } from './TypingGameWordData'
import { TypingProblemQuestioner } from './TypingProblemQuestioner'
import { keyCodeToChar } from '~/libs/Keys'
import { TypingGameInfo } from '~/libs/TypingGameInfo'
import { TypingGamerEnglish } from '~/libs/TypingGamerEnglish'
import { TypingGamerJapanese } from '~/libs/TypingGamerJapanese'

type TypingGamer = TypingGamerEnglish | TypingGamerJapanese

interface TypingEventDetail {
  keyCode?: number
  shiftKey?: boolean
  char?: string
}

type TypingEvent = CustomEvent<TypingEventDetail>

export class GameSetting {
  timeLimit: number = 0
  autoMode: number = 0
  randomMode: boolean = false
  goalCharCount: number = 0
  problemId: string = ''

  clear () {
    this.timeLimit = 0
    this.autoMode = 0
    this.randomMode = false
    this.goalCharCount = 0
    this.problemId = ''
  }
}

export class TypingGame {
  problem: TypingProblemQuestioner = null
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

  private readonly eventManager: EventManager
  private readonly timerManager: TimerManager

  private _stop: () => void = null

  constructor () {
    this.eventManager = new EventManager()
    this.timerManager = new TimerManager()
    this._initData()
  }

  private _initData () {
    this.problem = null
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
  }

  init ({
    problem = null,
    setting = null
  }: {
    problem?: TypingProblemQuestioner
    setting?: GameSetting
  }) {
    this._initData()
    this.problem = problem
    this.timeLimit = setting?.timeLimit || 0
    this.timeUse = 0
    this.goalCharCount = setting?.goalCharCount || 0
    this._stop = null
  }

  get current () {
    return this.problem?.current
  }

  get totalCharCount () {
    return this.problem?.totalCharCount
  }

  private _typing ({ gamer }: { gamer: TypingGamer }): EventListener {
    gamer.init(this.current)

    return (event: TypingEvent) => {
      if (this.pausing) {
        return
      }

      const detail = event.detail
      const char =
        detail.char || keyCodeToChar(detail.keyCode, detail.shiftKey)
      const word = this.current

      if (char) {
        this.totalTypeCount++
        if (gamer.expect(char, word)) {
          this.totalTypeCorrect++
        } else {
          this.totalTypeMiss++
        }

        if (this.goalCharCount > 0) {
          if (this.totalTypeCorrect >= this.goalCharCount && this._stop) {
            this._stop()
            return
          }
        }

        if (word.success) {
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

  private _keydown (): EventListener {
    return (e: KeyboardEvent) => {
      e.preventDefault()
      const { keyCode, shiftKey } = e
      const detail = { keyCode, shiftKey, char: null }
      const event = new CustomEvent('c:typing', { detail })
      window.dispatchEvent(event)
    }
  }

  private visibleChange () {
    if (document.hidden) {
      this.timerManager.pause()
    } else {
      this.timerManager.resume()
    }
  }

  private addTickTimer (timeLimit: number) {
    return this.timerManager.create({
      handler: () => {
        if (timeLimit > 0 && this.timeUse >= timeLimit) {
          this.cancel()
        } else if (this.isRunning) {
          this.tick += 10
          this.timeUse += 10
        }
      },
      interval: 10
    })
  }

  private addAutoTyping ({
    words,
    autoMode
  }: {
    words: TypingGameWordData[]
    autoMode: number
  }) {
    if (!autoMode) {
      return
    }

    const xs = Array.from(
      words.reduce((a, w) => a + w.wordState.remaining, '')
    )

    const timer = this.timerManager.create({
      handler: () => {
        if (!this.isRunning) {
          return
        }

        const char = xs.shift()
        if (char) {
          const detail = { char }
          const event = new CustomEvent('c:typing', { detail })
          window.dispatchEvent(event)
        } else {
          timer?.stop()
        }
      },
      interval: autoMode
    })

    return timer
  }

  async start ({
    problem,
    setting
  }: {
    problem: TypingProblemQuestioner
    setting: GameSetting
  }): Promise<TypingGameInfo> {
    this.cancel()

    const { words, type } = problem ?? {}
    const { timeLimit, autoMode } = setting
    this.init({ problem, setting })

    let gamer = null as TypingGamer
    if (type === 'english') {
      gamer = new TypingGamerEnglish()
    } else if (type === 'japanese') {
      gamer = new TypingGamerJapanese()
    }

    return await new Promise((resolve) => {
      const keydown = autoMode ? () => {} : this._keydown()
      const typing = this._typing({ gamer })

      this._stop = () => {
        this._stop = null
        this.running = false

        if (this.current && !this.current.endTime) {
          this.current.endTime = this.tick
        }

        this.eventManager.clear()
        this.timerManager.clear()

        resolve(this.info())
      }

      this.eventManager.add('keydown', keydown)
      this.eventManager.add('c:typing', typing)
      this.eventManager.add(
        'visibilitychange',
        this.visibleChange.bind(this),
        document
      )

      this.addTickTimer(timeLimit)
      this.addAutoTyping({ words, autoMode })
      this.timerManager.start()
      this.running = true
    })
  }

  cancel () {
    if (this._stop) {
      this.canceled = true
      this._stop()
    }
    this.eventManager.clear()
    this.timerManager.clear()
    return this.info()
  }

  pause () {
    if (this.isRunning) {
      this.pausing = true
      this.timerManager.pause()
      return true
    }
    return false
  }

  resume () {
    if (this.isPausing) {
      this.pausing = false
      this.timerManager.resume()
      return true
    }
    return false
  }

  get isPausing () {
    return this.running && this.pausing
  }

  get isRunning () {
    return this.running && !this.pausing
  }

  info () {
    return new TypingGameInfo(this)
  }

  dispose () {
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

  add (
    eventName: string,
    handler: EventListener,
    target?: Document | Element | Window
  ) {
    target = target || window
    target.addEventListener(eventName, handler)
    this.listeners.push({
      eventName,
      handler,
      target,
      active: true
    })
  }

  remove (
    eventName: string,
    handler: EventListener,
    target?: Document | Element | Window
  ) {
    target = target || window

    const targets = this.listeners.filter((it) => {
      it.active =
        it.eventName !== eventName ||
        it.handler !== handler ||
        it.target !== target
      return !it.active
    })

    this.listeners = this.listeners.filter(it => it.active)

    targets.forEach((it) => {
      it.target.removeEventListener(it.eventName, it.handler)
    })
  }

  clear () {
    const targets = [...this.listeners]
    this.listeners = []
    targets.forEach((it) => {
      it.target.removeEventListener(it.eventName, it.handler)
    })
  }
}

class TimerEntry {
  private uid: number
  private id: number
  private time: number
  private tick: number

  private readonly handler: () => void
  private readonly interval: () => number

  constructor (handler: () => void, interval: (() => number) | number) {
    if (typeof interval === 'function') {
      this.interval = interval
    } else {
      this.interval = () => interval
    }
    this.handler = handler
  }

  private * ticker () {
    while (true) {
      if (typeof this.tick === 'number') {
        this.time += this.tick
        yield this.tick
        delete this.tick
      }
      const next = this.interval()
      if (typeof next === 'number') {
        yield Math.max((this.time += next) - Date.now(), 0)
      } else {
        return
      }
    }
  }

  start () {
    const handler = this.handler
    const tick = this.ticker()

    const fn = () => {
      handler()
      const next = tick.next().value
      if (typeof next === 'number') {
        this.id = window.setTimeout(fn, next)
      }
    }

    this.time = Date.now()
    const next = tick.next().value
    if (typeof next === 'number') {
      this.uid = window.setTimeout(fn, next)
      this.id = this.uid
    } else {
      this.time = undefined
    }

    return this.uid
  }

  stop () {
    if (this.id) {
      this.tick = Math.max(this.time - Date.now(), 0)
      window.clearTimeout(this.id)
    }
    this.id = undefined
    this.time = undefined
  }
}

class TimerManager {
  private timers: TimerEntry[] = []

  create ({
    handler,
    interval
  }: {
    handler: () => void
    interval: (() => number) | number
  }) {
    const timer = new TimerEntry(handler, interval)
    this.timers.push(timer)
    return timer
  }

  start () {
    this.timers.forEach(timer => timer.start())
  }

  pause () {
    this.timers.forEach(timer => timer.stop())
  }

  resume () {
    this.start()
  }

  clear () {
    this.timers.forEach(timer => timer.stop())
    this.timers = []
  }
}
