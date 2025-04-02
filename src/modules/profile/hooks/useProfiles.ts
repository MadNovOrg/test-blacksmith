import { useQuery, gql } from 'urql'

import {
  GetProfilesQuery,
  GetProfilesQueryVariables,
  Profile_Bool_Exp,
} from '@app/generated/graphql'

export const GET_PROFILES = gql`
  query GetProfiles($limit: Int, $offset: Int, $where: profile_bool_exp) {
    profiles: profile(
      limit: $limit
      offset: $offset
      where: $where
      order_by: { fullName: asc }
    ) {
      id
      fullName
      avatar
      archived
      email
      countryCode
    }
    profile_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`

export type UseProfileProps = {
  limit: number
  offset: number
  where: Profile_Bool_Exp
}

export default function useProfiles({ where, limit, offset }: UseProfileProps) {
  const [{ data, error, fetching }, mutate] = useQuery<
    GetProfilesQuery,
    GetProfilesQueryVariables
  >({ query: GET_PROFILES, variables: { where, limit, offset } })

  return {
    mutate,
    profiles: data?.profiles ?? [],
    count: data?.profile_aggregate.aggregate?.count,
    error,
    isLoading: fetching,
  }
}
