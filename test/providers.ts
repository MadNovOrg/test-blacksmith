import { Profile } from '@app/types'

export interface Providers {
  auth: {
    login: jest.Mock
    logout: jest.Mock
    profile?: Profile
    loading: boolean
  }
}

export const defaultProviders: Providers = {
  auth: {
    login: jest.fn(async () => ({})),
    logout: jest.fn(async () => undefined),
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
      roles: [],
    },
    loading: false,
  },
}
