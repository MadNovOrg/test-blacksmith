import '@testing-library/jest-dom'
import 'mock-match-media/jest-setup.cjs'

import '@test/mockCognitoToProfile'

window.scrollTo = jest.fn()

global.afterEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
})
