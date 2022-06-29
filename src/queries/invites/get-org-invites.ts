import { gql } from 'graphql-request'

import { OrganizationInvite } from '@app/types'

import { PROFILE } from '../fragments'

export type ResponseType = {
  orgInvites: OrganizationInvite[]
  total: { aggregate: { count: number } }
}

export type ParamsType = {
  orgId: string
  where?: object
  limit?: number
  offset?: number
}

export const QUERY = gql`
  ${PROFILE}
  query GetOrgInvites(
    $orgId: uuid!
    $limit: Int = 20
    $offset: Int = 0
    $where: organization_invites_bool_exp = {}
  ) {
    orgInvites: organization_invites(
      where: { _and: [{ orgId: { _eq: $orgId } }, $where] }
      limit: $limit
      offset: $offset
      order_by: { createdAt: desc }
    ) {
      id
      createdAt
      updatedAt
      email
      status
      isAdmin
      profile {
        ...Profile
      }
      organization {
        ...Organization
      }
    }
    total: organization_invites_aggregate(
      where: { _and: [{ orgId: { _eq: $orgId } }, $where] }
    ) {
      aggregate {
        count
      }
    }
  }
`
