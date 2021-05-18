const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1))
    const tmp = array[i]
    array[i] = array[r]
    array[r] = tmp
  }
}

const spliceByQuantity = (words, quantity) => {
  if (quantity === 0) {
    return words.splice(0)
  }

  let chars = 0
  const ret = []
  for (const w of words) {
    const word = w.word
    ret.push(words.shift())
    chars += word.length
    if (chars >= quantity) {
      return ret
    }
  }

  return ret
}

class ProblemWord {
  constructor(word) {
    Object.assign(this, word)
    this._success = false
    this._mistake = false
  }

  sync(state) {
    this._mistake = state.mistake
    this._success = state.success
  }
}

export class TypingProblemQuestioner {
  constructor({ problem, setting }) {
    this.init({ problem, setting })
  }

  get hasNext() {
    return this._words.length > 0 || this.words.some((w) => !w._success)
  }

  init({ problem, setting }) {
    this._quantity = setting.quantity
    this._words = problem.words.map((w) => new ProblemWord(w))

    if (setting.randomMode) {
      shuffle(this._words)
    }

    this.id = problem.id
    this.type = problem.type
    this.words = spliceByQuantity(this._words, this._quantity)
  }

  next() {
    const n = this.words.filter((w) => w._success).length
    const nl = this.words.splice(n)
    if (nl.length) {
      this._words.unshift(...nl)
    }
    this._words.push(...this.words.splice(0))
    this.words.push(...spliceByQuantity(this._words, this._quantity))
  }
}

export default TypingProblemQuestioner
