import Chance from 'chance'

import { Profile } from '@app/types'

const chance = new Chance()

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
      id: chance.guid(),
      givenName: chance.first(),
      familyName: chance.last(),
      title: chance.prefix(),
      status: 'active',
      contactDetails: [{ email: chance.email() }],
      tags: [],
      addresses: [],
      attributes: [],
      preferences: [],
      createdAt: '',
      updatedAt: '',
    },
    loading: false,
  },
}
