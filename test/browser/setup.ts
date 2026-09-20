import { page } from 'vitest/browser'
import { render as _render } from '@nuxt/test-utils/browser'

import { clearEndpointRegistry } from '../utils'
import { disableAutoUnmount, enableAutoUnmount } from '@vue/test-utils'

const render: typeof _render = (C, options) => {
  return _render(C, {
    container: document.getElementById('__nuxt') ?? undefined,
    ...options,
  })
}

page.extend({
  render,
})

disableAutoUnmount()
enableAutoUnmount(afterEach)

afterAll(() => {
  clearEndpointRegistry()
})

export {}
