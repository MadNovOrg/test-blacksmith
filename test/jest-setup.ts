import '@testing-library/jest-dom'

import '@test/mockCognitoToProfile'

global.afterEach(() => {
  jest.clearAllMocks()
})
