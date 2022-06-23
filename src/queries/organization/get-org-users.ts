import { gql } from 'graphql-request'

import { Profile } from '@app/types'

import { PROFILE } from '../fragments'

export type ResponseType = {
  users: {
    profile: Profile & {
      activeCertificates: {
        aggregate: {
          count: number
        }
      }
    }
    isAdmin: boolean
  }[]
  total: {
    aggregate: {
      count: number
    }
  }
}

export type ParamsType = {
  orgId: string
  orderBy?: object
  limit?: number
  offset?: number
}

export const QUERY = gql`
  ${PROFILE}
  query GetOrgUsers(
    $orgId: uuid!
    $orderBy: [organization_member_order_by!] = { profile: { fullName: asc } }
    $limit: Int = 20
    $offset: Int = 0
  ) {
    users: organization_member(
      where: { organization_id: { _eq: $orgId } }
      order_by: $orderBy
      limit: $limit
      offset: $offset
    ) {
      profile {
        ...Profile
        activeCertificates: certificates_aggregate(
          where: { expiryDate: { _gt: "now()" } }
        ) {
          aggregate {
            count
          }
        }
      }
      isAdmin
    }
    total: organization_member_aggregate(
      where: { organization_id: { _eq: $orgId } }
    ) {
      aggregate {
        count
      }
    }
  }
`
