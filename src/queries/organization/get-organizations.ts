import { gql } from 'graphql-request'

import { ORGANIZATION, SHALLOW_ORGANIZATION } from '@app/queries/fragments'

export const QUERY = gql`
  ${ORGANIZATION}
  ${SHALLOW_ORGANIZATION}
  query GetOrganizations(
    $orderBy: [organization_order_by!] = { name: asc }
    $where: organization_bool_exp = {}
    $isShallow: Boolean = false
    $isNotShallow: Boolean = false
  ) {
    orgs: organization(where: $where, order_by: $orderBy) {
      ...Organization @include(if: $isNotShallow)
      ...ShallowOrganization @include(if: $isShallow)
      members @include(if: $isNotShallow) {
        profile {
          lastActivity
        }
      }
    }
  }
`
