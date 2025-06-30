export function fmtDispTime(time: number) {
  const t = Math.floor(Math.max(time, 0) / 10)
  const m = Math.floor(t / 100 / 60)
  const s = Math.floor((t / 100) % 60)
  const ss = ('0' + String(t % 100)).slice(-2)
  if (m > 0) {
    return `${m} 分 ${s} 秒 ${ss}`
  }
  return `${s} 秒 ${ss}`
}

export function fmtPercent(value: number, length = 1) {
  const n = value * 100
  const m = Math.pow(10, length)
  return String(Math.round(n * m) / m)
}
