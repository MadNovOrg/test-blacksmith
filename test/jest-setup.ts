import '@testing-library/jest-dom'
import 'mock-match-media/polyfill'
import '@inrupt/jest-jsdom-polyfills' // polyfills TextEncoder and TextDecoder used in @react-pdf

import '@test/mockCognitoToProfile'

window.scrollTo = jest.fn()

global.afterEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
})
