import {
  registerEndpoint as _registerEndpoint,
  mountSuspended,
} from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

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

type MountSuspendedOptions = Parameters<typeof mountSuspended<typeof App>>[1]

function setupTeleport() {
  document.getElementById('teleports')?.remove()
  const teleports = document.createElement('div')
  teleports.setAttribute('id', 'teleports')
  document.body.appendChild(teleports)
}

export async function mountAppSuspended(options?: MountSuspendedOptions) {
  setupTeleport()
  return await mountSuspended(App, {
    ...options,
    global: {
      ...options?.global,
      stubs: {
        ...options?.global?.stubs,
      },
    },
  })
}

export type AppPage = Awaited<ReturnType<typeof mountAppSuspended>>
