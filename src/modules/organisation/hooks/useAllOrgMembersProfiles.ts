import { gql, useQuery } from 'urql'

import {
  AllOrganizationProfilesQuery,
  AllOrganizationProfilesQueryVariables,
} from '@app/generated/graphql'

export const ALL_ORGANIZATION_PROFILES = gql`
  query AllOrganizationProfiles($org_id: uuid!) {
    organization_member(where: { organization_id: { _eq: $org_id } }) {
      profile_id
    }
  }
`

export function useAllOrganizationProfiles(org_id: string, pause = false) {
  const [{ data, fetching, error }] = useQuery<
    AllOrganizationProfilesQuery,
    AllOrganizationProfilesQueryVariables
  >({
    query: ALL_ORGANIZATION_PROFILES,
    variables: { org_id },
    pause: pause,
  })
  return {
    data,
    fetching,
    error,
  }
}
