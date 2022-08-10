import { gql } from 'graphql-request'

import { Address, Organization } from '@app/types'

import { ORGANIZATION } from '../fragments'

export type ResponseType = { org: Organization }

export type ParamsType = {
  name: string
  trustName: string
  trustType: string
  address: Address
  xeroId?: string
  invites?: { email: string; isAdmin: boolean }[]
}

export const MUTATION = gql`
  ${ORGANIZATION}
  mutation InsertOrg(
    $name: String!
    $trustName: String!
    $trustType: trust_type_enum!
    $address: jsonb!
    $xeroId: String
    $invites: [organization_invites_insert_input!] = []
  ) {
    org: insert_organization_one(
      object: {
        name: $name
        trustName: $trustName
        trustType: $trustType
        address: $address
        xeroContactId: $xeroId
        invites: { data: $invites }
      }
    ) {
      ...Organization
    }
  }
`
