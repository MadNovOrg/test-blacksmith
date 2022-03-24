import { gqlRequest } from '@app/lib/gql-request'

import type { CognitoUser, Profile } from './types'

import { getUserProfile } from '@app/queries/users'

export async function fetchUserProfile(user: CognitoUser) {
  try {
    const session = user.getSignInUserSession()
    if (!session) return

    const idToken = session.getIdToken()
    const accessToken = session.getAccessToken()
    const claims = JSON.parse(idToken.payload['https://hasura.io/jwt/claims'])

    const { profile } = await gqlRequest<{ profile: Profile }>(
      getUserProfile,
      { id: claims['x-hasura-user-id'] },
      idToken.getJwtToken()
    )

    return {
      claims,
      accessToken: accessToken.getJwtToken(),
      idToken: idToken.getJwtToken(),
      profile: {
        ...profile,
        allowedRoles: new Set(claims?.['x-hasura-allowed-roles'] ?? []),
      },
    }
  } catch (err) {
    console.error(err)
  }
}
