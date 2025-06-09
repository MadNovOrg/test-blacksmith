import { gql, useQuery } from 'urql'

import {
  GetBulkProfilesRolesByProfileIdQuery,
  GetBulkProfilesRolesByProfileIdQueryVariables,
} from '@app/generated/graphql'

const GET_PROFILES_ROLES_BY_PROFILE_ID = gql`
  query GetBulkProfilesRolesByProfileId($profileIds: [uuid!]!) {
    profile(where: { id: { _in: $profileIds } }) {
      id
      profile_trainer_agreement_types {
        id
        agreement_type
      }
      roles(where: { profile_id: { _in: $profileIds } }) {
        role {
          name
        }
      }
      trainer_role_types(where: { profile_id: { _in: $profileIds } }) {
        trainer_role_type {
          name
        }
      }
    }
  }
`

export const useProfileRoles = (profileIds: string[]) => {
  const [{ data, fetching }] = useQuery<
    GetBulkProfilesRolesByProfileIdQuery,
    GetBulkProfilesRolesByProfileIdQueryVariables
  >({
    query: GET_PROFILES_ROLES_BY_PROFILE_ID,
    variables: { profileIds },
  })
  return {
    data,
    fetching,
  }
}
