import { useQuery } from 'urql'

import {
  GetCourseParticipantsOrganizationsQuery,
  GetCourseParticipantsOrganizationsQueryVariables,
} from '@app/generated/graphql'
import { GET_COURSE_PARTICIPANTS_ORGANIZATIONS } from '@app/modules/course_details/course_attendees_tab/queries/getCourseParticipantsOrganizations'

export default function useCourseParticipantsOrganizations(
  courseId: number,
  where?: object,
  withTrainerOrganization?: boolean,
  trainersWithEvaluations?: string[],
) {
  const [{ data, error }] = useQuery<
    GetCourseParticipantsOrganizationsQuery,
    GetCourseParticipantsOrganizationsQueryVariables
  >({
    query: GET_COURSE_PARTICIPANTS_ORGANIZATIONS,
    variables: {
      courseId,
      where,
      withTrainerOrganization,
      trainersWithEvaluations,
    },
  })
  return { data, error }
}
