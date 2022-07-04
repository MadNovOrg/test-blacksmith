import { gql } from 'graphql-request'

import { Address, Organization } from '@app/types'

import { ORGANIZATION } from '../fragments'

export type ResponseType = { org: Organization }

export type ParamsType = {
  name: string
  address: Address
  xeroId?: string
  invites?: { email: string; isAdmin: boolean }[]
}

export const MUTATION = gql`
  ${ORGANIZATION}
  mutation InsertOrg(
    $name: String!
    $address: jsonb!
    $xeroId: String
    $invites: [organization_invites_insert_input!] = []
  ) {
    org: insert_organization_one(
      object: {
        name: $name
        address: $address
        xeroContactId: $xeroId
        invites: { data: $invites }
      }
    ) {
      ...Organization
    }
  }
`
