import { gql } from 'graphql-request'

import { ORGANIZATION } from '../fragments'

export const MUTATION = gql`
  ${ORGANIZATION}
  mutation InsertOrgLead(
    $name: String!
    $trustName: String!
    $trustType: trust_type_enum!
    $address: jsonb!
    $attributes: jsonb = {}
  ) {
    org: insert_organization_one(
      object: {
        name: $name
        trustName: $trustName
        trustType: $trustType
        address: $address
        attributes: $attributes
      }
    ) {
      ...Organization
    }
  }
`
