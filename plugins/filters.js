import Vue from 'vue'

const dispTime = (time) => {
  const t = Math.floor(time / 10)
  const m = Math.floor(t / 100 / 60)
  const s = Math.floor((t / 100) % 60)
  const ss = ('0' + (t % 100)).slice(-2)
  if (m > 0) {
    return `${m} 分 ${s} 秒 ${ss}`
  }
  return `${s} 秒 ${ss}`
}

const percent = (value, length = 1) => {
  if (value == null) {
    return ''
  }
  const n = Number(value) * 100
  const m = Math.pow(10, length)
  return Math.round(n * m) / m
}

Vue.filter('dispTime', dispTime)
Vue.filter('percent', percent)
