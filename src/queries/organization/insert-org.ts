import { gql } from 'graphql-request'

import { Address, Organization } from '@app/types'

import { ORGANIZATION } from '../fragments'

export type ResponseType = { org: Organization }

export type ParamsType = {
  name: string
  addresses: Address[]
}

export const MUTATION = gql`
  ${ORGANIZATION}
  mutation InsertOrg($name: String!, $addresses: jsonb!) {
    org: insert_organization_one(
      object: { name: $name, addresses: $addresses }
    ) {
      ...Organization
    }
  }
`
