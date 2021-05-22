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

const getScrollContainer = (node) => {
  if (node == null) {
    return null
  }

  if (node.scrollHeight > node.clientHeight) {
    return node
  } else {
    return getScrollContainer(node.parentNode)
  }
}

export default {
  countDown,
  wait,
  getScrollContainer,
}
