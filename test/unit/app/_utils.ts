import {
  registerEndpoint as _registerEndpoint,
  mountSuspended,
} from '@nuxt/test-utils/runtime'
import type { NitroFetchRequest } from 'nitropack'
import { vi } from 'vitest'
import App from '~/app.vue'
import { isFunction } from '~~/libs/Util'

export function endpointRegister() {
  type Options = Parameters<typeof _registerEndpoint>[1]

  const unregisters: (() => void)[] = []

  function registerEndpoint<Path extends NitroFetchRequest>(
    path: Path,
    options: Options,
  ) {
    const [method, _handler] = isFunction(options)
      ? ['GET' as const, options]
      : [options.method, options.handler]
    const handler = vi.isMockFunction(_handler) ? _handler : vi.fn(_handler)
    const unregister = _registerEndpoint(path as string, { method, handler })
    unregisters.push(unregister)
    return {
      handler,
      unregister,
    }
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
