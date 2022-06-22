import { gql } from 'graphql-request'

import { TrustType } from '@app/types'

export type ResponseType = { updated: { id: string } }

export type ParamsType = {
  id: string
  org: {
    name: string
    trustType: TrustType
    trustName: string
    sector: string
    attributes: {
      email: string
      phone: string
      localAuthority: string
      ofstedRating: string
      ofstedLastInspection: string | null
      headFirstName: string
      headLastName: string
      headTitle: string
      headPreferredJobTitle: string
      website: string
    }
  }
}

export const MUTATION = gql`
  mutation UpdateOrg($org: organization_set_input = {}, $id: uuid!) {
    updated: update_organization_by_pk(pk_columns: { id: $id }, _set: $org) {
      id
    }
  }
`
