import { gql, useQuery } from 'urql'

import {
  GetAllOrganisationsStatisticsQuery,
  GetAllOrganisationsStatisticsQueryVariables,
} from '@app/generated/graphql'

export const GET_ALL_ORGANISATION_STATISTICS = gql`
  query GetAllOrganisationsStatistics {
    organizations_statistics_aggregate {
      aggregate {
        sum {
          active_certifications
          expired_recently_certifications
          expiring_soon_certifications
          individuals
          on_hold_certifications
        }
      }
    }
  }
`

export function useAllOrganisationStatistics(pause = false) {
  const [{ data, fetching, error }] = useQuery<
    GetAllOrganisationsStatisticsQuery,
    GetAllOrganisationsStatisticsQueryVariables
  >({
    query: GET_ALL_ORGANISATION_STATISTICS,
    pause,
    requestPolicy: 'network-only',
  })
  return {
    data,
    fetching,
    error,
  }
}
