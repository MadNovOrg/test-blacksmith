import { gql, useQuery } from 'urql'

import {
  GetProfilesOrganisationsByProfileIdQuery,
  GetProfilesOrganisationsByProfileIdQueryVariables,
} from '@app/generated/graphql'

export const GET_PROFILES_ORGANISATIONS_BY_PROFILE_ID = gql`
  query GetProfilesOrganisationsByProfileId($profileIds: [uuid!]!) {
    profile(where: { id: { _in: $profileIds } }) {
      id
      organizations {
        isAdmin
        organization {
          id
          name
        }
      }
    }
  }
`

export const useProfilesOrganisations = (profileIds: string[]) => {
  const [{ data, fetching }] = useQuery<
    GetProfilesOrganisationsByProfileIdQuery,
    GetProfilesOrganisationsByProfileIdQueryVariables
  >({
    query: GET_PROFILES_ORGANISATIONS_BY_PROFILE_ID,
    variables: { profileIds },
  })
  return {
    data,
    fetching,
  }
}
