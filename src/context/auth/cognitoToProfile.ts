import { gqlRequest } from '@app/lib/gql-request'
import { getUserProfile } from '@app/queries/users'

import type { Claims, CognitoUser, Profile } from './types'

type QueryResponseType = {
  profile: (Profile & { adminRights: { aggregate: { count: number } } }) | null
}

export type CognitoProfileDetails = {
  profile?: QueryResponseType['profile']
  isOrgAdmin?: boolean
  claims?: Claims
  emailVerified?: boolean
}

/**
 * Must be in a dedicated file for mock testing
 */
export default async function (
  user: CognitoUser
): Promise<CognitoProfileDetails> {
  const session = user.getSignInUserSession()
  if (!session) return {}

  const idToken = session.getIdToken()
  const token = idToken.getJwtToken()
  const claims = JSON.parse(
    idToken.payload['https://hasura.io/jwt/claims']
  ) as Claims

  const { profile } = await gqlRequest<QueryResponseType>(
    getUserProfile,
    { id: claims['x-hasura-user-id'] },
    { token }
  )

  return {
    profile: profile ?? undefined,
    isOrgAdmin: Boolean(profile?.adminRights.aggregate.count),
    claims,
    emailVerified: idToken.payload.email_verified,
  }
}
