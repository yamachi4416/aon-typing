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

export default {
  countDown,
}
