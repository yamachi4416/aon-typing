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

const mapModel = (modelName, fieldNames) => {
  return fieldNames.reduce(
    (a, name) => ({
      ...a,
      [name]: {
        get() {
          return this[modelName][name]
        },
        set(val) {
          this.$set(this[modelName], name, val)
        },
      },
    }),
    {}
  )
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
    const optinos = { top, left }
    if (behavior) {
      optinos.behavior = behavior
    }
    sc.scrollTo(optinos)
  })
}

export default {
  countDown,
  wait,
  getScrollContainer,
  scrollTo,
  mapModel,
}
