import { gql } from 'graphql-request'

export const DELETE_ORG = gql`
  mutation DeleteOrg($orgId: uuid!) {
    deleteOrganisation(orgId: $orgId) {
      success
    }
  }
`
