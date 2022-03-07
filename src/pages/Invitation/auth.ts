import {
  CognitoUser,
  CognitoUserSession,
  CognitoUserPool,
  CognitoIdToken,
  CognitoAccessToken,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js'

import tokens from './temp-tokens.json'
import TempStorage from './storage'

const UserPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID as string
const ClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID as string

declare module 'amazon-cognito-identity-js' {
  interface CognitoUser {
    refreshSessionIfPossible: () => Promise<void>
  }
}

export function getServiceAuth(
  { AccessToken, IdToken, RefreshToken } = tokens.AuthenticationResult // TODO: remove when email is done
) {
  const user = new CognitoUser({
    Username: 'service.user@teamteach.co.uk',
    Pool: new CognitoUserPool({ UserPoolId, ClientId }),
    Storage: TempStorage,
  })

  const session = new CognitoUserSession({
    IdToken: new CognitoIdToken({ IdToken }),
    AccessToken: new CognitoAccessToken({ AccessToken }),
    RefreshToken: new CognitoRefreshToken({ RefreshToken }),
  })

  user.setSignInUserSession(session)

  return user
}
