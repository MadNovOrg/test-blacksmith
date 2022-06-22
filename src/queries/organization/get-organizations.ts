import { gql } from 'graphql-request'

import { ORGANIZATION } from '@app/queries/fragments'
import { Organization } from '@app/types'

export type ResponseType = {
  orgs: (Organization & {
    members?: {
      profile: {
        lastActivity: Date
      }
    }[]
  })[]
}

export type ParamsType = {
  orderBy?: object
  where?: object
}

export const QUERY = gql`
  ${ORGANIZATION}
  query GetOrganizations(
    $orderBy: [organization_order_by!] = { name: asc }
    $where: organization_bool_exp = {}
  ) {
    orgs: organization(where: $where, order_by: $orderBy) {
      ...Organization
      members {
        profile {
          lastActivity
        }
      }
    }
  }
`
