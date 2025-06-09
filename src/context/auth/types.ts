import { CognitoUser } from 'amazon-cognito-identity-js'

import { Course_Level_Enum, Grade_Enum } from '@app/generated/graphql'
import { Profile, RoleName } from '@app/types'

import { getACL } from './permissions'

export type { Profile } from '@app/types'

export type { CognitoUser } from 'amazon-cognito-identity-js'

export type E = { code: number; message: string }
export type LoginResult = { error?: E; user?: CognitoUser }

export type AuthState = {
  profile?: Profile
  isOrgAdmin?: boolean
  managedOrgIds?: string[]
  organizationIds?: string[]
  defaultRole?: RoleName
  claimsRoles?: Set<RoleName>
  allowedRoles?: Set<RoleName> // roles allowed e.g. assigned + inherited
  activeRole?: RoleName
  queryRole?: RoleName
  verified?: boolean
  autoLoggedOut?: boolean
  loggedOut?: boolean
  trainerRoles?: string[]
  certificates?: {
    courseLevel: Course_Level_Enum
    expiryDate: string
  }[]
  activeCertificates?: { level: Course_Level_Enum; grade: Grade_Enum | null }[]
  individualAllowedRoles?: Set<
    RoleName.BOOKING_CONTACT | RoleName.ORGANIZATION_KEY_CONTACT
  >
}

export interface AuthContextType extends AuthState {
  loading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  logout: (auto?: boolean) => Promise<void>
  getJWT: () => Promise<string>
  changeRole: (role: RoleName) => void
  loadProfile: (user: CognitoUser) => Promise<AuthState | void>
  reloadCurrentProfile: () => Promise<AuthState | void>
  acl: ReturnType<typeof getACL>
}

export type Claims = {
  'x-hasura-user-id': string
  'x-hasura-user-email': string
  'x-hasura-allowed-roles': RoleName[]
  'x-hasura-default-role': RoleName
  'x-hasura-tt-organizations': string
}

export enum AuthMode {
  LOGIN = 'login',
  REGISTER = 'register',
}
