import { gql } from 'graphql-request'

import { Address, Organization } from '@app/types'

import { ORGANIZATION } from '../fragments'

export type ResponseType = { org: Organization }

export type ParamsType = {
  name: string
  address: Address
  attributes?: {
    adminEmail: string
  }
  xeroId?: string
}

export const MUTATION = gql`
  ${ORGANIZATION}
  mutation InsertOrg(
    $name: String!
    $address: jsonb!
    $attributes: jsonb
    $xeroId: String
  ) {
    org: insert_organization_one(
      object: {
        name: $name
        address: $address
        attributes: $attributes
        xeroContactId: $xeroId
      }
    ) {
      ...Organization
    }
  }
`
