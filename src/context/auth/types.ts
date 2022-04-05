import type { CourseType, Profile, RoleName } from '@app/types'

export type { Profile } from '@app/types'

export type { CognitoUser } from 'amazon-cognito-identity-js'

export type E = { code: number; message: string }
export type LoginResult = { error?: E }

export type AuthState = {
  token?: string
  profile?: Profile
  organizationIds?: string[]
  defaultRole?: RoleName
  allowedRoles?: Set<RoleName> // roles allowed e.g. assigned + inherited
  activeRole?: RoleName
}

export interface AuthContextType extends AuthState {
  loading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => Promise<void>
  changeRole: (role: RoleName) => void
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
  canViewMyTraining: () => boolean
  canViewTrainerBase: () => boolean
  canViewMyOrganization: () => boolean
  canViewMembership: () => boolean
  canViewAdmin: () => boolean
  canCreateCourse: (type: CourseType) => boolean
}
