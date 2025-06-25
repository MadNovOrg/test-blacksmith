import { useCallback, useMemo } from 'react'
import { gql, useClient, useMutation } from 'urql'

import {
  CheckTtClientsQuery,
  CheckTtClientsQueryVariables,
  NotifyInternalUsersOfInviteAttemptMutation,
  NotifyInternalUsersOfInviteAttemptMutationVariables,
} from '@app/generated/graphql'

export const CHECK_TT_CLIENTS = gql`
  query CheckTTClients($input: CheckTTClientsInput!) {
    checkTTClients(input: $input) {
      clientEmails
      nonClientEmails
    }
  }
`

const NOTIFY_INTERNAL_USERS_OF_INVITE_ATTEMPT = gql`
  mutation NotifyInternalUsersOfInviteAttempt(
    $input: NotifyInternalUsersOfInviteAttemptInput!
  ) {
    notifyInternalUsersOfInviteAttempt(input: $input) {
      success
    }
  }
`

export function useInviteTTClientsToIndirectCourses() {
  const client = useClient()

  const checkTTClients = useCallback(
    async (
      variables: CheckTtClientsQueryVariables,
    ): Promise<CheckTtClientsQuery['checkTTClients']> => {
      let inviteeCourses = {} as CheckTtClientsQuery['checkTTClients']
      await client
        .query<CheckTtClientsQuery, CheckTtClientsQueryVariables>(
          CHECK_TT_CLIENTS,
          variables,
        )
        .toPromise()
        .then(({ data }) => {
          if (data) inviteeCourses = data.checkTTClients
          else inviteeCourses = { clientEmails: [], nonClientEmails: [] }
        })
      return inviteeCourses
    },
    [client],
  )

  const [, notifyInternalsOfIndirectInviteAttempt] = useMutation<
    NotifyInternalUsersOfInviteAttemptMutation,
    NotifyInternalUsersOfInviteAttemptMutationVariables
  >(NOTIFY_INTERNAL_USERS_OF_INVITE_ATTEMPT)

  return useMemo(
    () => ({
      checkTTClients,
      notifyInternalsOfIndirectInviteAttempt,
    }),
    [checkTTClients, notifyInternalsOfIndirectInviteAttempt],
  )
}
