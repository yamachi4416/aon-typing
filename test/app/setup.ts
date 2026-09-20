import { disableAutoUnmount, enableAutoUnmount } from '@vue/test-utils'
import { clearEndpointRegistry } from '../utils'

disableAutoUnmount()
enableAutoUnmount(afterEach)

afterAll(() => {
  clearEndpointRegistry()
})
