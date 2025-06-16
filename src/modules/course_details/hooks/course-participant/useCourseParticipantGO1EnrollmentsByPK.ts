import { useMemo } from 'react'
import { useQuery } from 'urql'

import {
  CourseParticipantByPkQuery,
  CourseParticipantByPkQueryVariables,
  GetUserGo1EnrollmentsQuery,
  GetUserGo1EnrollmentsQueryVariables,
} from '@app/generated/graphql'

import { GET_COURSE_PARTICIPANT_BY_PK } from './get-course-participants'
import { GET_USER_GO1_ENROLLMENTS } from './get-user-go1-enrollments'

export default function useCourseParticipantGO1EnrollmentsByPK(id: string) {
  const [
    {
      data: courseParticipantData,
      error: errorCourseParticipant,
      fetching: fetchingCourseParticipant,
    },
  ] = useQuery<CourseParticipantByPkQuery, CourseParticipantByPkQueryVariables>(
    {
      query: GET_COURSE_PARTICIPANT_BY_PK,
      requestPolicy: 'network-only',
      variables: { id },
    },
  )

  const [
    {
      data: userGO1EnrollmentsData,
      error: errorUserGO1Enrollments,
      fetching: fetchingUserGO1Enrollments,
    },
  ] = useQuery<GetUserGo1EnrollmentsQuery, GetUserGo1EnrollmentsQueryVariables>(
    {
      query: GET_USER_GO1_ENROLLMENTS,
      requestPolicy: 'network-only',
      variables: {
        profileId: courseParticipantData?.courseParticipant?.profile?.id ?? '',
      },
      pause: !courseParticipantData?.courseParticipant?.profile?.id,
    },
  )

  const resp = useMemo(
    () => ({
      blendedLearningEnrollments:
        userGO1EnrollmentsData?.enrollments?.enrollments ?? [],
      courseParticipant: courseParticipantData?.courseParticipant ?? null,
      loading: fetchingCourseParticipant || fetchingUserGO1Enrollments,
      error: errorCourseParticipant || errorUserGO1Enrollments || null,
    }),
    [
      courseParticipantData?.courseParticipant,
      errorCourseParticipant,
      errorUserGO1Enrollments,
      fetchingCourseParticipant,
      fetchingUserGO1Enrollments,
      userGO1EnrollmentsData?.enrollments?.enrollments,
    ],
  )

  return resp
}
