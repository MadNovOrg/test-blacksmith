import { CognitoUser } from 'amazon-cognito-identity-js'

import type { CourseType, Profile, RoleName } from '@app/types'

export type { Profile } from '@app/types'

export type { CognitoUser } from 'amazon-cognito-identity-js'

export type E = { code: number; message: string }
export type LoginResult = { error?: E }

export type AuthState = {
  profile?: Profile
  isOrgAdmin?: boolean
  organizationIds?: string[]
  defaultRole?: RoleName
  allowedRoles?: Set<RoleName> // roles allowed e.g. assigned + inherited
  activeRole?: RoleName
  verified?: boolean
}

export interface AuthContextType extends AuthState {
  loading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => Promise<void>
  getJWT: () => Promise<string>
  changeRole: (role: RoleName) => void
  loadProfile: (user: CognitoUser) => Promise<void>
  reloadCurrentProfile: () => Promise<void>
  acl: ACL
}

export type Claims = {
  'x-hasura-user-id': string
  'x-hasura-user-email': string
  'x-hasura-allowed-roles': RoleName[]
  'x-hasura-default-role': RoleName
  'x-hasura-tt-organizations': string
}

export type ACL = {
  isAdmin: () => boolean
  isTTAdmin: () => boolean
  isTTOps: () => boolean
  isTrainer: () => boolean
  canViewMyOrganization: () => boolean
  canViewMembership: () => boolean
  canViewAdmin: () => boolean
  canCreateCourse: (type: CourseType) => boolean
  canAssignLeadTrainer: () => boolean
  canViewContacts: () => boolean
  canViewAllOrganizations: () => boolean
  canViewOrganizations: () => boolean
  canViewCertifications: () => boolean
  canViewOrders: () => boolean
  canOverrideGrades: () => boolean
  canViewXeroConnect: () => boolean
  canCreateOrgs: () => boolean
}
