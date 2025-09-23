import { AwsRegions } from '@app/types'

import { _render } from '@test/index'

import { RegistrationPage } from './Registration'

describe(RegistrationPage.name, () => {
  vitest.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  it('should render', () => {
    expect(RegistrationPage).toBeDefined()
  })
})
