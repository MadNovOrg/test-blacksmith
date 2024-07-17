import { gql } from 'graphql-request'

import { ORGANIZATION } from '@app/queries/fragments'
import { Organization } from '@app/types'

export type ResponseType = {
  organizations: Organization[]
  organizationsAggregation: { aggregate: { count: number } }
}

export type ParamsType = {
  limit?: number
  offset?: number
  orderBy?: object
}

export const QUERY = gql`
  ${ORGANIZATION}
  query Organizations(
    $limit: Int = 20
    $offset: Int = 0
    $orderBy: [organization_order_by!] = { name: asc }
  ) {
    organizations: organization(
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      ...Organization
      members_aggregate {
        aggregate {
          count
        }
      }
    }
    organizationsAggregation: organization_aggregate {
      aggregate {
        count
      }
    }
  }
`
