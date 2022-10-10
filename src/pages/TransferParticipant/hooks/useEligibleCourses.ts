import { useQuery } from 'urql'

import {
  TransferEligibleCoursesQuery,
  TransferEligibleCoursesQueryVariables,
} from '@app/generated/graphql'

import { useTransferParticipantContext } from '../components/TransferParticipantProvider'
import { TRANSFER_ELIGIBLE_COURSES } from '../queries'

export function useEligibleCourses() {
  const { fromCourse } = useTransferParticipantContext()

  const [{ data, fetching, error }] = useQuery<
    TransferEligibleCoursesQuery,
    TransferEligibleCoursesQueryVariables
  >({
    query: TRANSFER_ELIGIBLE_COURSES,
    variables: { level: fromCourse?.level, startDate: fromCourse?.start },
  })

  return {
    courses: data,
    fetching,
    error,
  }
}
