import { useQuery } from 'urql'

import {
  TransferEligibleCoursesQuery,
  TransferEligibleCoursesQueryVariables,
} from '@app/generated/graphql'

import { useTransferParticipantContext } from '../components/TransferParticipantProvider'
import { TRANSFER_ELIGIBLE_COURSES } from '../queries'

export function useEligibleCourses() {
  const { fromCourse, participant } = useTransferParticipantContext()

  if (!fromCourse) {
    throw new Error('From course needed')
  }

  const [{ data, fetching, error }] = useQuery<
    TransferEligibleCoursesQuery,
    TransferEligibleCoursesQueryVariables
  >({
    query: TRANSFER_ELIGIBLE_COURSES,
    variables: { fromCourseId: fromCourse.id, participantId: participant?.id },
    requestPolicy: 'cache-and-network',
  })

  return {
    courses: data?.eligibleTransferCourses,
    fetching,
    error,
  }
}
