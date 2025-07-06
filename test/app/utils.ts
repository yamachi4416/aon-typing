import { registerEndpoint as _registerEndpoint } from '@nuxt/test-utils/runtime'

export function endpointRegister() {
  const unregisters: (() => void)[] = []

  const registerEndpoint: typeof _registerEndpoint = (...args) => {
    const unregister = _registerEndpoint(...args)
    unregisters.push(unregister)
    return unregister
  }

  const unregisterEndpoints = () => {
    unregisters.splice(0).forEach((unregister) => unregister())
  }

  return {
    registerEndpoint,
    unregisterEndpoints,
  }
}
