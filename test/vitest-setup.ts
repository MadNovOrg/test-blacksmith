import '@testing-library/jest-dom'
import 'mock-match-media/polyfill'
import '@inrupt/jest-jsdom-polyfills' // polyfills TextEncoder and TextDecoder used in @react-pdf
import { setMedia } from 'mock-match-media'
import { vi } from 'vitest'

import '@test/mockCognitoToProfile'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true })

global.beforeAll(() => {
  setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode
})

global.afterEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})
