import { gql, useSubscription } from 'urql'

import {
  ImportUsersJobSubscription,
  ImportUsersJobSubscriptionVariables,
} from '@app/generated/graphql'

const IMPORT_USERS_JOB_SUBSCRIPTION = gql`
  subscription ImportUsersJob($id: uuid!) {
    import_users_job_by_pk(id: $id) {
      id
      result
      status
    }
  }
`

export function useImportUsersJobSubscription(jobId: string | null) {
  return useSubscription<
    ImportUsersJobSubscription,
    ImportUsersJobSubscription,
    ImportUsersJobSubscriptionVariables
  >(
    {
      query: IMPORT_USERS_JOB_SUBSCRIPTION,
      variables: jobId ? { id: jobId } : undefined,
      pause: !jobId,
    },
    (_data, response) => response
  )
}
