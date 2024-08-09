import { gql, useQuery } from 'urql'

import {
  GetUpcomingEnrollmentsStatsQuery,
  GetUpcomingEnrollmentsStatsQueryVariables,
  Upcoming_Enrollments_Bool_Exp,
} from '@app/generated/graphql'

export const GET_UPCOMING_ENROLLMENTS_STATS = gql`
  query GetUpcomingEnrollmentsStats($where: upcoming_enrollments_bool_exp!) {
    active_enrollments: upcoming_enrollments_aggregate(
      distinct_on: [profileId, courseId]
      where: { _and: [$where, { certification_status: { _eq: "ACTIVE" } }] }
    ) {
      aggregate {
        count
      }
    }
    on_hold_enrollments: upcoming_enrollments_aggregate(
      distinct_on: [profileId, courseId]
      where: { _and: [$where, { certification_status: { _eq: "ON_HOLD" } }] }
    ) {
      aggregate {
        count
      }
    }
    expired_recently_enrollments: upcoming_enrollments_aggregate(
      distinct_on: [profileId, courseId]
      where: {
        _and: [$where, { certification_status: { _eq: "EXPIRED_RECENTLY" } }]
      }
    ) {
      aggregate {
        count
      }
    }
    expiring_soon_enrollments: upcoming_enrollments_aggregate(
      distinct_on: [profileId, courseId]
      where: {
        _and: [$where, { certification_status: { _eq: "EXPIRING_SOON" } }]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`

export function useUpcomingEnrollmentsStats({
  where,
}: {
  where: Upcoming_Enrollments_Bool_Exp
}) {
  const [{ data, fetching, error }] = useQuery<
    GetUpcomingEnrollmentsStatsQuery,
    GetUpcomingEnrollmentsStatsQueryVariables
  >({
    query: GET_UPCOMING_ENROLLMENTS_STATS,
    variables: {
      where,
    },
    requestPolicy: 'cache-and-network',
  })
  return {
    data,
    fetching,
    error,
  }
}
