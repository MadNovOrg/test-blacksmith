import { gql } from 'graphql-request'

import { PROFILE } from '@app/queries/fragments'
import { Profile } from '@app/types'

export type ResponseType = {
  profiles: Profile[]
  profilesAggregation: { aggregate: { count: number } }
}

export type ParamsType = {
  limit?: number
  offset?: number
  orderBy?: object
  where?: object
}

export const GET_CONTACTS = gql`
  ${PROFILE}
  query GetContacts(
    $limit: Int = 20
    $offset: Int = 0
    $orderBy: [profile_order_by!] = { familyName: asc }
    $where: profile_bool_exp = {}
  ) {
    profiles: profile(
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: $where
    ) {
      ...Profile
      organizations {
        organization {
          name
        }
      }
      roles {
        role {
          name
        }
      }
    }
    profilesAggregation: profile_aggregate {
      aggregate {
        count
      }
    }
  }
`
