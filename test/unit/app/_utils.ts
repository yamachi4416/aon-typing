import type { RouteRecord, RouteRecordRaw } from '#vue-router'
import {
  registerEndpoint as _registerEndpoint,
  mountSuspended,
} from '@nuxt/test-utils/runtime'
import type { BaseWrapper } from '@vue/test-utils'
import { DOMWrapper, flushPromises } from '@vue/test-utils'
import type { NitroFetchRequest } from 'nitropack'
import type { Mock } from 'vitest'
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
  const page = await mountSuspended(App, {
    ...options,
    global: {
      ...options?.global,
      stubs: {
        ...options?.global?.stubs,
      },
    },
  })
  await flushPromises()
  return page
}

type SetupRoutes = (routes: RouteRecord[]) => RouteRecordRaw[]

export function routerSetup(defaultSetup?: SetupRoutes) {
  const router = useRouter()
  const savedRoutes = [...router.getRoutes()]

  function resetRoutes() {
    router.clearRoutes()
    for (const route of savedRoutes) {
      router.addRoute(route)
    }
  }

  function setupRoutes(setup?: SetupRoutes) {
    resetRoutes()
    const setupFn = setup ?? defaultSetup
    if (!setupFn) return
    const routes = setupFn(router.getRoutes())
    router.clearRoutes()
    for (const route of routes) {
      router.addRoute(route)
    }
  }

  return {
    resetRoutes,
    setupRoutes,
  }
}

export function mockNavigateTo(navigateToMock: Mock<typeof navigateTo>) {
  function setupNavigateToMock() {
    const router = useRouter()
    return navigateToMock
      .mockClear()
      .mockImplementation(async (to, options) => {
        if (!to) return
        if (options?.replace) {
          return await router.replace(to)
        }
        return await router.push(to)
      })
  }

  async function waitForNavigateTo() {
    const { results, settledResults } = navigateToMock.mock
    if (results.length && settledResults.length < results.length) {
      await results.at(-1)?.value
      return true
    }
    return false
  }

  return {
    setupNavigateToMock,
    waitForNavigateTo,
  }
}

export function toTablesArray(component: BaseWrapper<Node>) {
  type N<V> = V | N<V>[]

  const mapValues = (c: Element): N<string> => c.children.length
    ? Array.from(c.children).map(mapValues)
    : c.textContent

  const toTableArray = (table?: HTMLTableElement) => table
    ? Array.from(table.getElementsByTagName('tr')).map(mapValues)
    : undefined

  return component.findAll('table')
    .filter((table) => table.exists())
    .map((table) => toTableArray(table.element))
    .flat()
}

export function findTableValueCell(component: BaseWrapper<Node>, label: string) {
  const th = component.findAll('th').find((x) => x.text() === label)
  return new DOMWrapper(th?.element.nextElementSibling)
}
