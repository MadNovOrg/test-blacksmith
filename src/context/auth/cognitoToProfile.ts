import { GET_USER_PROFILE } from '@app/context/auth/queries/users'
import {
  GetProfileByIdQuery,
  GetProfileByIdQueryVariables,
} from '@app/generated/graphql'
import { gqlRequest } from '@app/lib/gql-request'

import type { Claims, CognitoUser, Profile } from './types'

type ProfileType =
  | (Profile & {
      adminRights: { aggregate: { count: number } }
      trainerRoles: { trainer_role_type: { name: string } }[]
    })
  | null

export type CognitoProfileDetails = {
  profile?: ProfileType
  isOrgAdmin?: boolean
  managedOrgIds?: string[]
  claims?: Claims
  emailVerified?: boolean
}

/**
 * Must be in a dedicated file for mock testing
 */
export default async function (
  user: CognitoUser,
): Promise<CognitoProfileDetails> {
  const session = user.getSignInUserSession()
  if (!session) return {}

  const idToken = session.getIdToken()
  const token = idToken.getJwtToken()
  const claims = JSON.parse(
    idToken.payload['https://hasura.io/jwt/claims'] ?? '{}',
  ) as Claims

  const { profile } = await gqlRequest<
    GetProfileByIdQuery,
    GetProfileByIdQueryVariables
  >(GET_USER_PROFILE, { id: claims['x-hasura-user-id'] }, { token })

  return {
    profile: profile as ProfileType,
    isOrgAdmin: Boolean(profile?.managedOrgIds?.length),
    managedOrgIds: profile?.managedOrgIds.map(o => o.organization_id),
    claims,
    emailVerified: idToken.payload.email_verified,
  }
}
