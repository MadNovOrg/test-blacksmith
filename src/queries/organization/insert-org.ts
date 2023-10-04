import { gql } from 'graphql-request'

import { ORGANIZATION } from '../fragments'

export const MUTATION = gql`
  ${ORGANIZATION}
  mutation InsertOrg(
    $name: String!
    $sector: String
    $address: jsonb!
    $attributes: jsonb = {}
    $xeroId: String
    $invites: [organization_invites_insert_input!] = []
  ) {
    org: insert_organization_one(
      object: {
        name: $name
        sector: $sector
        address: $address
        attributes: $attributes
        xeroContactId: $xeroId
        invites: { data: $invites }
      }
    ) {
      ...Organization
    }
  }
`
