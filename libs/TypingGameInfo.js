export default class {
  constructor(info) {
    Object.assign(this, info)
  }

  get time() {
    return this.tick
  }

  get missCount() {
    return this.totalTypeMiss
  }

  get correctRate() {
    return this.totalTypeCount ? this.totalTypeCorrect / this.totalTypeCount : 0
  }

  get wordPerMin() {
    return Math.round((this.totalTypeCount / this.time) * 60000)
  }

  get score() {
    return Math.round(this.wordPerMin * Math.pow(this.correctRate, 3))
  }

  get missKeys() {
    const sums = this.words
      .reduce((a, w) => a.concat(w.misses), [])
      .reduce((a, w) => {
        a[w] = (a[w] || 0) + 1
        return a
      }, {})

    return Object.keys(sums)
      .map((w) => ({ w, c: sums[w] }))
      .sort((a, b) => a.c - b.c)
  }

  get rank() {
    const s = this.score || 0
    if (s <= 55) {
      return 'E'
    }
    if (s <= 106) {
      return 'D'
    }
    if (s <= 157) {
      return 'C'
    }
    if (s <= 208) {
      return 'B'
    }
    if (s <= 259) {
      return 'A'
    }
    if (s <= 276) {
      return 'S'
    }
    if (s <= 299) {
      return "S'"
    }
    return "S''"
  }
}
