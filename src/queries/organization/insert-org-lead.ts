import { gql } from 'graphql-request'

import { ORGANIZATION } from '../fragments'

export const MUTATION = gql`
  ${ORGANIZATION}
  mutation InsertOrgLead(
    $name: String!
    $sector: String!
    $orgType: String!
    $address: jsonb!
    $attributes: jsonb = {}
  ) {
    org: insert_organization_one(
      object: {
        name: $name
        address: $address
        attributes: $attributes
        sector: $sector
        organisation_type: $orgType
      }
    ) {
      name
    }
  }
`
