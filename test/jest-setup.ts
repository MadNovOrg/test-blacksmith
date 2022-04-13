import '@testing-library/jest-dom'
import 'mock-match-media/jest-setup.cjs'

import '@test/mockCognitoToProfile'

global.afterEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
})
