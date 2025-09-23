import React from 'react'

import { AuthContext } from '../../src/context/auth'
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
