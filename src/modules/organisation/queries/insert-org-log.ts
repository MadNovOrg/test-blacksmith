import { gql } from 'graphql-request'
import { useMutation } from 'urql'

import {
  InsertOrgLogMutation,
  InsertOrgLogMutationVariables,
} from '@app/generated/graphql'
export const INSERT_ORGANISATION_LOG_MUTATION = gql`
  mutation InsertOrgLog(
    $orgId: uuid!
    $userId: uuid!
    $createfrom: org_created_from_enum!
    $op: cud_operation_enum!
    $updated_columns: jsonb = {}
  ) {
    org_log: insert_organisation_log_one(
      object: {
        organisation_id: $orgId
        actioned_by: $userId
        actioned_from: $createfrom
        operation: $op
        updated_columns: $updated_columns
      }
    ) {
      id
    }
  }
`

export const useInsertOrganisationLog = () => {
  return useMutation<InsertOrgLogMutation, InsertOrgLogMutationVariables>(
    INSERT_ORGANISATION_LOG_MUTATION,
  )
}
