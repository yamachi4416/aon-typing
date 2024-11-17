import { setup } from '@nuxt/test-utils'
import { beforeAll } from 'vitest'

beforeAll(() => {
  setup({ host: process.env.TEST_ENDPOINT, browser: true })
})
