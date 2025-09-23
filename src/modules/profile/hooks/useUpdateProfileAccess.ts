import { gql, useMutation } from 'urql'

import {
  UpdateProfileAccessMutation,
  UpdateProfileAccessMutationVariables,
} from '@app/generated/graphql'

export const UPDATE_PROFILE_ACCESS_TO_KNOWLEDGE_HUB = gql`
  mutation UpdateProfileAccess(
    $profileId: uuid!
    $canAccessKnowledgeHub: Boolean!
  ) {
    update_profile_by_pk(
      pk_columns: { id: $profileId }
      _set: { canAccessKnowledgeHub: $canAccessKnowledgeHub }
    ) {
      canAccessKnowledgeHub
    }
  }
`
export function useUpdateProfileAccess() {
  return useMutation<
    UpdateProfileAccessMutation,
    UpdateProfileAccessMutationVariables
  >(UPDATE_PROFILE_ACCESS_TO_KNOWLEDGE_HUB)
}
