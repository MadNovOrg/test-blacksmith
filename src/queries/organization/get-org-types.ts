import { gql } from 'graphql-request'

export const GET_ORG_TYPES = gql`
  query getOrgTypes($sector: organisation_sector_enum!) {
    organization_type(where: { sector: { _eq: $sector } }) {
      id
      name
    }
  }
`
