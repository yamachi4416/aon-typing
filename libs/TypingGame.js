import Keys from '~/libs/Keys'
import TypingGameInfo from '~/libs/TypingGameInfo'
import TypingGamerEnglish from '~/libs/TypingGamerEnglish'
import TypingGamerJapanese from '~/libs/TypingGamerJapanese'

const typingHandlers = {}

const addEventHandler = (eventName, handler, target) => {
  target = target || window
  target.addEventListener(eventName, handler)
  if (!typingHandlers[eventName]) {
    typingHandlers[eventName] = []
  }
  typingHandlers[eventName].push(handler)
}
const removeEventHandler = (eventName, handler, target) => {
  target = target || window
  target.removeEventListener(eventName, handler)
  if (typingHandlers[eventName]) {
    typingHandlers[eventName] = typingHandlers[eventName].filter(
      (f) => f !== handler
    )
  }
}
const removeAllEventHandler = () => {
  Object.keys(typingHandlers).forEach((eventName) => {
    typingHandlers[eventName].forEach((handler) => {
      window.removeEventListener(eventName, handler)
    })
    delete typingHandlers[eventName]
  })
}

const intervalTimerIds = {}
const startIntervalTimer = (func, interval) => {
  const id = setInterval(func, interval)
  intervalTimerIds[id] = true
  return id
}
const stopIntervalTimer = (id) => {
  clearInterval(id)
  delete intervalTimerIds[id]
}
const stopAllIntervalTimer = () => {
  Object.keys(intervalTimerIds).forEach((id) => {
    stopIntervalTimer(id)
  })
}

class TypingGame {
  constructor() {
    this._initData()
  }

  _initData() {
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

  init({ problem, setting }) {
    this._initData()

    setting = setting || {}
    this.problem = problem
    this.timeLimit = setting.timeLimit || 0
    this.timeUse = 0
    this.goalCharCount = setting.goalCharCount || 0
    this._stop = null
  }

  get current() {
    return this.problem?.current
  }

  get totalCharCount() {
    return this.problem?.totalCharCount
  }

  _typing({ gamer }) {
    gamer.init(this.current)

    return (event) => {
      if (this.pausing) {
        return
      }

      const detail = event.detail
      const char =
        detail.char || Keys.keyCodeToChar(detail.keyCode, detail.shiftKey)
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
          this.problem.nextWord()

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

  _keydown() {
    return (e) => {
      e.preventDefault()
      const { keyCode, shiftKey } = e
      const detail = { keyCode, shiftKey, char: null }
      const event = new CustomEvent('c:typing', { detail })
      window.dispatchEvent(event)
    }
  }

  _visibleChange(ticks) {
    return () => {
      if (document.hidden) {
        ticks.forEach((t) => t.stop())
      } else {
        ticks.forEach((t) => t.start())
      }
    }
  }

  _tickTimer(timeLimit) {
    const tick = () => {
      if (timeLimit > 0 && this.timeUse >= timeLimit) {
        this.cancel()
      } else if (this.isRunning) {
        this.tick += 10
        this.timeUse += 10
      }
    }

    let id = null
    return {
      start() {
        this.stop()
        id = startIntervalTimer(tick, 10)
      },
      stop() {
        if (id !== null) {
          stopIntervalTimer(id)
          id = null
        }
      },
    }
  }

  _autoTyping({ words, autoMode }) {
    if (!autoMode) {
      return {
        start() {},
        stop() {},
      }
    }

    let id = null
    const xs = Array.from(words.reduce((a, w) => a + w.wordState.remaining, ''))
    const tick = () => {
      if (!this.isRunning) {
        return
      }

      const char = xs.shift()
      if (char) {
        const detail = { char }
        const event = new CustomEvent('c:typing', { detail })
        window.dispatchEvent(event)
      } else {
        stopIntervalTimer(id)
      }
    }

    return {
      start() {
        this.stop()
        id = startIntervalTimer(tick, autoMode)
      },
      stop() {
        if (id !== null) {
          stopIntervalTimer(id)
          id = null
        }
      },
    }
  }

  start({ problem, setting }) {
    this.cancel()

    const { words, type } = problem
    const { timeLimit, autoMode } = setting
    this.init({ problem, setting })

    let gamer = null
    if (type === 'english') {
      gamer = new TypingGamerEnglish()
    } else if (type === 'japanese') {
      gamer = new TypingGamerJapanese()
    }

    const promis = new Promise((resolve) => {
      const keydown = autoMode ? () => {} : this._keydown()
      const typing = this._typing({ gamer })
      const ticks = [
        this._tickTimer(timeLimit),
        this._autoTyping({ words, autoMode }),
      ]
      const visibilitychange = this._visibleChange(ticks)

      this._stop = () => {
        this._stop = null
        this.running = false

        if (this.current && !this.current.endTime) {
          this.current.endTime = this.tick
        }

        ticks.forEach((t) => t.stop())

        removeEventHandler('keydown', keydown)
        removeEventHandler('c:typing', typing)
        removeEventHandler('visibilitychange', visibilitychange, document)

        resolve(this.info())
      }

      addEventHandler('keydown', keydown)
      addEventHandler('c:typing', typing)
      addEventHandler('visibilitychange', visibilitychange, document)

      ticks.forEach((t) => t.start())
      this.running = true
    })

    return promis
  }

  cancel() {
    if (this._stop) {
      this.canceled = true
      this._stop()
    }
    removeAllEventHandler()
    stopAllIntervalTimer()
    return this.info()
  }

  pause() {
    if (this.isRunning) {
      this.pausing = true
      return true
    }
    return false
  }

  resume() {
    if (this.isPausing) {
      this.pausing = false
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
    removeAllEventHandler()
    stopAllIntervalTimer()
  }
}

export default TypingGame
