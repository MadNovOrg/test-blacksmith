import { gqlRequest } from '@app/lib/gql-request'

import type { CognitoUser, Profile, Claims } from './types'

import { getUserProfile } from '@app/queries/users'
import { RoleName } from '@app/types'

export async function fetchUserProfile(user: CognitoUser) {
  try {
    const session = user.getSignInUserSession()
    if (!session) return

    const idToken = session.getIdToken()
    const claims = JSON.parse(
      idToken.payload['https://hasura.io/jwt/claims']
    ) as Claims

    const { profile } = await gqlRequest<{ profile: Profile }>(
      getUserProfile,
      { id: claims['x-hasura-user-id'] },
      idToken.getJwtToken()
    )

    const orgIdsPgLiteral = claims['x-hasura-tt-organizations'] ?? '{}'

    return {
      token: idToken.getJwtToken(),
      profile,
      organizationIds: JSON.parse(`[${orgIdsPgLiteral.slice(1, -1)}]`),
      defaultRole: claims['x-hasura-default-role'] || RoleName.USER,
      allowedRoles: new Set(claims['x-hasura-allowed-roles'] ?? []),
    }
  } catch (err) {
    console.error(err)
  }
}
