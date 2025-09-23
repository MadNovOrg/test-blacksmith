import { gql } from 'graphql-request'

import { ORGANIZATION } from '@app/queries/fragments'

export const INSERT_ORGANISATION_MUTATION = gql`
  ${ORGANIZATION}
  mutation InsertOrg(
    $name: String!
    $sector: String
    $address: jsonb!
    $attributes: jsonb = {}
    $xeroId: String
    $organisationType: String!
    $invites: [organization_invites_insert_input!] = []
    $dfeEstablishmentId: uuid
    $mainOrgId: uuid
  ) {
    org: insert_organization_one(
      object: {
        name: $name
        sector: $sector
        main_organisation_id: $mainOrgId
        organisationType: $organisationType
        address: $address
        attributes: $attributes
        xeroContactId: $xeroId
        dfeEstablishmentId: $dfeEstablishmentId
        invites: { data: $invites }
      }
    ) {
      ...Organization
    }
  }
`
