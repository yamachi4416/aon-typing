import { setup } from '@nuxt/test-utils'

beforeAll(() => {
  setup({ host: process.env.TEST_ENDPOINT, browser: true })
})
