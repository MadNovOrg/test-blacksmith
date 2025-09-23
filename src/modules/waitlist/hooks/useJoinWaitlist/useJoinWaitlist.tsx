import { gql, useMutation } from 'urql'

import {
  JoinWaitlistMutation,
  JoinWaitlistMutationVariables,
} from '@app/generated/graphql'

export const JOIN_WAITLIST = gql`
  mutation JoinWaitlist($input: JoinWaitlistInput!) {
    joinWaitlist(input: $input) {
      success
    }
  }
`

export const useJoinWaitlist = () => {
  return useMutation<JoinWaitlistMutation, JoinWaitlistMutationVariables>(
    JOIN_WAITLIST,
  )
}
