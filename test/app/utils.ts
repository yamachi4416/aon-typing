import { registerEndpoint as _registerEndpoint } from '@nuxt/test-utils/runtime'

export function endpointSubscriber() {
  const unSubscribes: (() => void)[] = []

  const registerEndpoint: typeof _registerEndpoint = (...args) => {
    const unSubscribe = _registerEndpoint(...args)
    unSubscribes.push(unSubscribe)
    return unSubscribe
  }

  const unSubscribeEndpoints = () => {
    unSubscribes.splice(0).forEach((unSubscribe) => unSubscribe())
  }

  return {
    registerEndpoint,
    unSubscribeEndpoints,
  }
}
