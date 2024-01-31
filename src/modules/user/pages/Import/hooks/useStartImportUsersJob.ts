import { gql, useMutation } from 'urql'

import {
  StartImportUsersJobMutation,
  StartImportUsersJobMutationVariables,
} from '@app/generated/graphql'

const IMPORT_USERS = gql`
  mutation StartImportUsersJob($input: ImportUsersInput!) {
    importUsers(input: $input) {
      jobId
    }
  }
`

export function useStartImportUsersJob() {
  return useMutation<
    StartImportUsersJobMutation,
    StartImportUsersJobMutationVariables
  >(IMPORT_USERS)
}
