import type { ContextType as AuthContextType } from '@app/context/auth'

import { RoleName } from '@app/types'

export interface Providers {
  auth: {
    login: jest.Mock
    logout: jest.Mock
    profile: AuthContextType['profile']
    loading: boolean
  }
}

export const defaultProviders: Providers = {
  auth: {
    login: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
    loading: false,
    profile: {
      id: 'cacb559d-b85d-5e64-b623-37252520ebda',
      givenName: 'John',
      familyName: 'Smith',
      title: 'Mr',
      status: 'active',
      contactDetails: [],
      email: 'john.smith@example.com',
      tags: [],
      addresses: [],
      attributes: [],
      preferences: [],
      createdAt: '',
      updatedAt: '',
      organizations: [],
      roles: [{ role: { name: RoleName.USER } }],
      allowedRoles: new Set([RoleName.USER]),
    },
  },
}
