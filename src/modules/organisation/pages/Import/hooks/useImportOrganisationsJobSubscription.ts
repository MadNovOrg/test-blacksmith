import { gql, useSubscription } from 'urql'

import {
  ImportOrganisationsJobSubscription,
  ImportOrganisationsJobSubscriptionVariables,
} from '@app/generated/graphql'

export const IMPORT_ORGANISATIONS_JOB_SUBSCRIPTION = gql`
  subscription ImportOrganisationsJob($id: uuid!) {
    import_job_by_pk(id: $id) {
      id
      result
      status
    }
  }
`

export function useImportOrganisationsJobSubscription(jobId: string | null) {
  return useSubscription<
    ImportOrganisationsJobSubscription,
    ImportOrganisationsJobSubscription,
    ImportOrganisationsJobSubscriptionVariables
  >(
    {
      query: IMPORT_ORGANISATIONS_JOB_SUBSCRIPTION,
      variables: jobId ? { id: jobId } : undefined,
      pause: !jobId,
    },
    (_data, response) => response,
  )
}
