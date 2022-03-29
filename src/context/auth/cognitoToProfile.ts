import { gqlRequest } from '@app/lib/gql-request'

import type { CognitoUser, Profile, Claims } from './types'

import { getUserProfile } from '@app/queries/users'

/**
 * Must be in a dedicated file for mock testing
 */
export default async function (user: CognitoUser) {
  const session = user.getSignInUserSession()
  if (!session) return {}

  const idToken = session.getIdToken()
  const token = idToken.getJwtToken()
  const claims = JSON.parse(
    idToken.payload['https://hasura.io/jwt/claims']
  ) as Claims

  const { profile } = await gqlRequest<{ profile: Profile | null }>(
    getUserProfile,
    { id: claims['x-hasura-user-id'] },
    { token }
  )

  return { profile: profile ?? undefined, claims, token }
}
