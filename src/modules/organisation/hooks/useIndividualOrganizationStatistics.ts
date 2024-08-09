import { gql, useQuery } from 'urql'

import {
  GetOrganizationStatisticsQuery,
  GetOrganizationStatisticsQueryVariables,
} from '@app/generated/graphql'

export const GET_ORGANIZATION_STATISTICS = gql`
  query GetOrganizationStatistics($orgIds: [uuid!]) {
    organizations_statistics(where: { organization_id: { _in: $orgIds } }) {
      id
      organization_id
      active_certifications
      expired_recently_certifications
      expiring_soon_certifications
      individuals
      on_hold_certifications
    }
  }
`

export function useIndividualOrganizationStatistics(
  orgIds: string[],
  pause = false,
) {
  const [{ data, fetching, error }] = useQuery<
    GetOrganizationStatisticsQuery,
    GetOrganizationStatisticsQueryVariables
  >({
    query: GET_ORGANIZATION_STATISTICS,
    variables: { orgIds },
    pause,
    requestPolicy: 'network-only',
  })
  return {
    data,
    fetching,
    error,
  }
}
