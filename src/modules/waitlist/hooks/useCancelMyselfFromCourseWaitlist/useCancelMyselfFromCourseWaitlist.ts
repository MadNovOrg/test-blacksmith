import { gql } from 'graphql-request'
import { useMutation } from 'urql'

import {
  CancelMyselfFromCourseWaitlistMutation,
  CancelMyselfFromCourseWaitlistMutationVariables,
} from '@app/generated/graphql'

export const CANCEL_MYSELF_FROM_COURSE_WAITLIST_MUTATION = gql`
  mutation CancelMyselfFromCourseWaitlist(
    $courseId: Int!
    $cancellationSecret: uuid!
  ) {
    cancelMyselfFromCourseWaitlist(
      input: { courseId: $courseId, cancellationSecret: $cancellationSecret }
    ) {
      success
      error
    }
  }
`

export const useCancelMyselfFromCourseWaitlist = () => {
  return useMutation<
    CancelMyselfFromCourseWaitlistMutation,
    CancelMyselfFromCourseWaitlistMutationVariables
  >(CANCEL_MYSELF_FROM_COURSE_WAITLIST_MUTATION)
}
