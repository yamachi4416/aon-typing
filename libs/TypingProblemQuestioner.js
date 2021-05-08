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
    chars += word.length
    if (chars >= quantity) {
      return ret
    }
    ret.push(words.shift())
  }

  return ret
}

export class TypingProblemQuestioner {
  constructor({ problem, setting }) {
    this.init({ problem, setting })
  }

  get hasNext() {
    return this._words.length > 0
  }

  init({ problem, setting }) {
    this._quantity = setting.quantity
    this._words = problem.words.slice(0)

    if (setting.randomMode) {
      shuffle(this._words)
    }

    this.id = problem.id
    this.type = problem.type
    this.words = spliceByQuantity(this._words, this._quantity)
  }

  next(n = 0) {
    const nl = this.words.splice(n)
    if (nl.length) {
      this._words.unshift(...nl)
    }
    this._words.push(...this.words.splice(0))
    this.words.push(...spliceByQuantity(this._words, this._quantity))
  }
}

export default TypingProblemQuestioner
