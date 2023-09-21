import { gql } from 'graphql-request'

import { SHALLOW_ORGANIZATION } from '@app/queries/fragments'

export const QUERY = gql`
  ${SHALLOW_ORGANIZATION}
  query GetShallowOrganizations(
    $orderBy: [organization_order_by!] = { name: asc }
    $where: organization_bool_exp = {}
  ) {
    orgs: organization(where: $where, order_by: $orderBy) {
      ...ShallowOrganization
    }
  }
`
