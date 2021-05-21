import { TypingGameWordData } from './TypingGameWordData'

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1))
    const tmp = array[i]
    array[i] = array[r]
    array[r] = tmp
  }
}

export class TypingProblemQuestioner {
  constructor({ problem, setting }) {
    this.init({ problem, setting })
  }

  get id() {
    return this.problem?.id
  }

  get type() {
    return this.problem?.type
  }

  get hasNext() {
    return this.words.length > 0
  }

  get totalCharCount() {
    return (
      this.words.reduce((a, w) => a + w.wordState.words.length, 0) +
      this.endWords.reduce((a, w) => a + w.wordState.words.length, 0)
    )
  }

  get current() {
    return this.words[0]
  }

  init({ problem, setting }) {
    this.problem = problem
    this.words = problem.words.map((w, i) => new TypingGameWordData(i, w))
    this.endWords = []
    this.setting = setting

    if (setting.randomMode) {
      shuffle(this.words)
    }
  }

  nextWord() {
    this.endWords.push(this.words.shift())
  }

  reset() {
    this.init(this)
  }

  continue() {
    this.endWords.splice(0)
    this.words.forEach((w, i) => w.continue(i))
  }
}

export default TypingProblemQuestioner
