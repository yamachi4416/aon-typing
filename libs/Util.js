const countDown = (count, tick) => {
  return new Promise((resolve) => {
    const id = setInterval(() => {
      tick(--count)
      if (count <= 0) {
        clearInterval(id)
        resolve(count)
      }
    }, 1000)
  })
}

const wait = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export default {
  countDown,
  wait,
}
