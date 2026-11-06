import { inject } from 'vitest'
import { setup } from '@nuxt/test-utils/e2e'

await setup({ host: inject('serverUrl'), browser: true })
