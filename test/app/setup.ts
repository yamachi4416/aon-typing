import { disableAutoUnmount, enableAutoUnmount } from '@vue/test-utils'

disableAutoUnmount()
enableAutoUnmount(afterAll)

beforeEach(async () => {
  const app = useNuxtApp()
  // clearNuxtState(() => true, { reset: true })
  for (const [key, state] of Object.entries(app._state)) {
    app.payload[key] = state!._default()
  }
})
