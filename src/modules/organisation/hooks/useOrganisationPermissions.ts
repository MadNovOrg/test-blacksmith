import { gql, useMutation, useQuery } from 'urql'

import {
  GetOrganisationPermissionsQuery,
  GetOrganisationPermissionsQueryVariables,
  UpdateOrganisationPermissionsMutation,
  UpdateOrganisationPermissionsMutationVariables,
} from '@app/generated/graphql'

export const GET_ORGANISATION_ACCESS_TO_KNOWLEDGE_HUB = gql`
  query GetOrganisationPermissions($orgId: uuid!) {
    organization_by_pk(id: $orgId) {
      canAccessKnowledgeHub
    }
  }
`

export function useOrganisationPermissions(orgId: string) {
  return useQuery<
    GetOrganisationPermissionsQuery,
    GetOrganisationPermissionsQueryVariables
  >({
    query: GET_ORGANISATION_ACCESS_TO_KNOWLEDGE_HUB,
    variables: {
      orgId,
    },
  })
}

export const UPDATE_ORGANISATION_ACCESS_TO_KNOWLEDGE_HUB = gql`
  mutation UpdateOrganisationPermissions(
    $orgId: uuid!
    $canAccessKnowledgeHub: Boolean!
  ) {
    update_organization_by_pk(
      pk_columns: { id: $orgId }
      _set: { canAccessKnowledgeHub: $canAccessKnowledgeHub }
    ) {
      canAccessKnowledgeHub
    }
  }
`

export function useUpdateOrganisationPermissions() {
  return useMutation<
    UpdateOrganisationPermissionsMutation,
    UpdateOrganisationPermissionsMutationVariables
  >(UPDATE_ORGANISATION_ACCESS_TO_KNOWLEDGE_HUB)
}
