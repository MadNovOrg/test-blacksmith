import React from 'react'
import { DeepPartial } from 'ts-essentials'
import { deepmerge } from 'deepmerge-ts'

import { AuthContext } from '../../src/context/auth'
import { Providers, defaultProviders } from '../../test/providers'
import { injectACL } from '../../src/context/auth/permissions'

export default function withAuthContext(auth: any) {
  return (Story: any) => {
    return (
      <AuthContext.Provider value={injectACL(auth)}>
        <Story />
      </AuthContext.Provider>
    )
  }
}
