import { TypingInfoState, TypingWordState } from '~/libs/TypingStates'
import Keys from '~/libs/Keys'
import TypingGameInfo from '~/libs/TypingGameInfo'
import TypingGamerEnglish from '~/libs/TypingGamerEnglish'
import TypingGamerJapanese from '~/libs/TypingGamerJapanese'

const typingHandlers = {}

const addEventHandler = (eventName, handler) => {
  window.addEventListener(eventName, handler)
  if (!typingHandlers[eventName]) {
    typingHandlers[eventName] = []
  }
  typingHandlers[eventName].push(handler)
}
const removeEventHandler = (eventName, handler) => {
  window.removeEventListener(eventName, handler)
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

class TypingWordGameData {
  constructor(i, data) {
    Object.assign(this, {
      ...data,
      index: i,
      startTime: 0,
      endTime: 0,
      count: 0,
      misses: [],
      infoState: new TypingInfoState(data.info, data.info2),
      wordState: new TypingWordState(data.word),
    })
  }

  get mistake() {
    return this.misses.length
  }

  get success() {
    return this.wordState.finished
  }
}

class TypingGame {
  constructor() {
    this._initData()
  }

  _initData() {
    this.tick = 0
    this.wordIndex = 0
    this.pausing = false
    this.canceled = false
    this.running = false
    this.timeLimit = 0
    this.timeUse = 0
    this.current = null
    this.totalWordCount = 0
    this.totalTypeCount = 0
    this.totalTypeCorrect = 0
    this.totalTypeMiss = 0
  }

  init({ words, setting }) {
    this._initData()

    setting = setting || {}
    this.timeLimit = setting.timeLimit || 0
    this.timeUse = this.timeLimit
    this._stop = null

    this.words = (words || []).reduce((a, w, i) => {
      a.push(new TypingWordGameData(i, w))

      this.totalWordCount += w.word.length

      return a
    }, [])

    this.current = this.words[this.wordIndex]
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

        if (word.success) {
          word.endTime = this.tick
          this.wordIndex++
          this.current = this.words[this.wordIndex]

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

  start({ problem, setting }) {
    this.cancel()

    const { words, type } = problem
    const { timeLimit, autoMode } = setting
    this.init({ words, setting })

    let gamer = null
    if (type === 'english') {
      gamer = new TypingGamerEnglish()
    } else if (type === 'japanese') {
      gamer = new TypingGamerJapanese()
    } else {
      throw 'not suppert problem type.'
    }

    const promis = new Promise((resolve) => {
      const keydown = autoMode ? () => {} : this._keydown()
      const typing = this._typing({ gamer })
      const autoTyping = this.autoTyping({ words, autoMode })
      const tickTimer = startIntervalTimer(() => {
        if (timeLimit > 0 && this.timeUse <= 1) {
          this.cancel()
        } else if (!this.pausing) {
          this.tick += 10
          this.timeUse -= 10
        }
      }, 10)

      this._stop = () => {
        this._stop = null
        this.running = false

        if (this.current && !this.current.endTime) {
          this.current.endTime = this.tick
        }

        stopIntervalTimer(tickTimer)

        autoTyping()

        removeEventHandler('keydown', keydown)
        removeEventHandler('c:typing', typing)

        resolve(this.info())
      }

      this.running = true
      addEventHandler('keydown', keydown)
      addEventHandler('c:typing', typing)

      autoTyping()
    })

    return promis
  }

  autoTyping({ words, autoMode }) {
    if (!autoMode) {
      return () => {}
    }

    let id = null
    const xs = words.reduce((a, d) => a + d.word, '').split('')
    return () => {
      if (id === null) {
        id = startIntervalTimer(() => {
          if (this.pausing) {
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
        }, autoMode)
      } else {
        stopIntervalTimer(id)
      }
    }
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
    const res = { ...this }
    return new TypingGameInfo(res)
  }
}

export default TypingGame
