import { gql } from 'graphql-request'
import { useMutation } from 'urql'

import {
  InsertOrgLeadMutation,
  InsertOrgLeadMutationVariables,
} from '@app/generated/graphql'

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
        organisationType: $orgType
      }
    ) {
      id
      name
    }
  }
`

export const useInsertNewOrganization = () => {
  return useMutation<InsertOrgLeadMutation, InsertOrgLeadMutationVariables>(
    MUTATION
  )
}
