import { MarkOptional } from 'ts-essentials'

import type { AuthContextType } from '@app/context/auth/types'

import { RoleName } from '@app/types'

export interface Providers {
  auth: MarkOptional<AuthContextType, 'acl'> & {
    login: jest.Mock
    logout: jest.Mock
    acl?: AuthContextType['acl']
  }
}

export const defaultProviders: Providers = {
  auth: {
    login: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
    loading: false,
    allowedRoles: new Set([RoleName.USER]),
    profile: {
      id: 'cacb559d-b85d-5e64-b623-37252520ebda',
      givenName: 'John',
      familyName: 'Smith',
      fullName: 'John Smith',
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
    },
  },
}
