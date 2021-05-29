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
    if (node.tagName === 'HTML') {
      return window
    }
    return node
  } else {
    return getScrollContainer(node.parentNode)
  }
}

const scrollTo = (node, { top = 0, left = 0, behavior = 'smooth' } = {}) => {
  return new Promise((resolve) => {
    const sc = getScrollContainer(node)
    if (!sc) {
      resolve()
    }

    const check =
      sc === window ? () => window.scrollY === top : () => sc.scrollTop === top
    const handler = () => {
      if (check()) {
        resolve()
      }
    }

    sc.addEventListener('scroll', handler)
    handler()
    sc.scrollTo({ top, left, behavior })
  })
}

export default {
  countDown,
  wait,
  getScrollContainer,
  scrollTo,
}
