import { MarkOptional } from 'ts-essentials'

import type { AuthContextType } from '@app/context/auth/types'
import { RoleName, TrainerRoleTypeName } from '@app/types'

export const profile = {
  id: 'cacb559d-b85d-5e64-b623-37252520ebda',
  givenName: 'John',
  familyName: 'Smith',
  fullName: 'John Smith',
  title: 'Mr',
  contactDetails: [],
  email: 'john.smith@example.com',
  avatar: '',
  phone: '+44 1234555',
  dob: '2002-04-06',
  jobTitle: 'Developer',
  tags: [],
  addresses: [],
  attributes: [],
  preferences: [],
  createdAt: '',
  updatedAt: '',
  organizations: [],
  roles: [{ role: { id: '1', name: RoleName.USER } }],
  trainer_role_types: [
    { trainer_role_type: { id: '1', name: TrainerRoleTypeName.PRINCIPAL } },
  ],
  dietaryRestrictions: null,
  disabilities: null,
  lastActivity: new Date('2020-01-01 00:00:00'),
} as AuthContextType['profile']

export interface Providers {
  auth: MarkOptional<AuthContextType, 'acl'> & {
    login: jest.Mock
    logout: jest.Mock
    changeRole: jest.Mock
    acl?: AuthContextType['acl']
  }
}

export const defaultProviders: Providers = {
  auth: {
    login: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
    changeRole: jest.fn().mockResolvedValue(undefined),
    getJWT: jest.fn().mockResolvedValue(undefined),
    loading: false,
    defaultRole: RoleName.USER,
    allowedRoles: new Set([RoleName.USER]),
    claimsRoles: new Set([RoleName.USER]),
    activeRole: RoleName.USER,
    queryRole: RoleName.USER,
    loadProfile: jest.fn().mockResolvedValue(undefined),
    reloadCurrentProfile: jest.fn().mockResolvedValue(undefined),
    profile,
  },
}
