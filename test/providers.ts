import { MarkOptional } from 'ts-essentials'
import vi, { vi as v } from 'vitest'

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
    login: vi.Mock
    logout: vi.Mock
    changeRole: vi.Mock
    acl?: AuthContextType['acl']
  }
}

export const defaultProviders: Providers = {
  auth: {
    login: v.fn().mockResolvedValue(undefined),
    logout: v.fn().mockResolvedValue(undefined),
    changeRole: v.fn().mockResolvedValue(undefined),
    getJWT: v.fn().mockResolvedValue(undefined),
    loading: false,
    defaultRole: RoleName.USER,
    allowedRoles: new Set([RoleName.USER]),
    claimsRoles: new Set([RoleName.USER]),
    activeRole: RoleName.USER,
    queryRole: RoleName.USER,
    loadProfile: v.fn().mockResolvedValue(undefined),
    reloadCurrentProfile: v.fn().mockResolvedValue(undefined),
    profile,
  },
}
