import type { Profile, RoleName } from '@app/types'

export type { Profile } from '@app/types'

export type { CognitoUser } from 'amazon-cognito-identity-js'

export type E = { code: number; message: string }
export type LoginResult = { error?: E }

export type AuthState = {
  loading: boolean
  claims?: {
    'x-hasura-user-id': string
    'x-hasura-user-email': string
    'x-hasura-allowed-roles': RoleName[]
    'x-hasura-default-role': RoleName
    'x-hasura-tt-organizations': string
  }
  accessToken?: string
  idToken?: string
  profile?: Profile
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => Promise<void>
  acl: ACL
}

export type ACLInput = {
  profile: AuthContextType['profile']
  acl?: ACL
}

export type ACL = {
  isAdmin: () => boolean
  isTrainer: () => boolean
  canViewTrainerBase: () => boolean
}
