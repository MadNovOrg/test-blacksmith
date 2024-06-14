import { useQuery, gql } from 'urql'

import {
  GetProfilesQuery,
  GetProfilesQueryVariables,
  Order_By,
  Profile_Bool_Exp,
  Profile_Order_By,
} from '@app/generated/graphql'
import { Sorting } from '@app/hooks/useTableSort'

export const GET_PROFILES = gql`
  query GetProfiles(
    $limit: Int
    $offset: Int
    $orderBy: [profile_order_by!]
    $where: profile_bool_exp
  ) {
    profiles: profile(
      limit: $limit
      offset: $offset
      where: $where
      order_by: $orderBy
    ) {
      id
      fullName
      avatar
      archived
      email
      countryCode
      organizations {
        isAdmin
        organization {
          id
          name
        }
      }
      roles {
        role {
          id
          name
        }
      }
      trainer_role_types {
        trainer_role_type {
          name
          id
        }
      }
    }
    profile_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`

export type UseProfileProps = {
  sorting: Sorting
  limit: number
  offset: number
  where: Profile_Bool_Exp
}

export default function useProfiles({
  sorting,
  where,
  limit,
  offset,
}: UseProfileProps) {
  const orderBy = getOrderBy(sorting)

  const [{ data, error, fetching }, mutate] = useQuery<
    GetProfilesQuery,
    GetProfilesQueryVariables
  >({ query: GET_PROFILES, variables: { where, orderBy, limit, offset } })

  return {
    mutate,
    profiles: data?.profiles ?? [],
    count: data?.profile_aggregate.aggregate?.count,
    error,
    isLoading: fetching,
  }
}

export function getOrderBy({
  by,
  dir,
}: Pick<Sorting, 'by' | 'dir'>): Profile_Order_By {
  switch (by) {
    case 'fullName':
    case 'email':
      return { [by]: dir }

    default: {
      return { fullName: Order_By.Asc }
    }
  }
}
