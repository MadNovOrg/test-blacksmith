import '@testing-library/jest-dom'
import 'mock-match-media/polyfill'
import '@inrupt/jest-jsdom-polyfills' // polyfills TextEncoder and TextDecoder used in @react-pdf
import { setMedia } from 'mock-match-media'

import '@test/mockCognitoToProfile'

window.scrollTo = jest.fn()

global.beforeAll(() => {
  setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode
})

global.afterEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
})
