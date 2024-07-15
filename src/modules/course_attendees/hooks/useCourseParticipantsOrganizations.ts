import { gql, useQuery } from 'urql'

import {
  GetCourseParticipantsOrganizationsQuery,
  GetCourseParticipantsOrganizationsQueryVariables,
} from '@app/generated/graphql'

const GET_COURSE_PARTICIPANTS_ORGANIZATIONS = gql`
  query GetCourseParticipantsOrganizations($courseId: Int!) {
    course_participant(where: { course_id: { _eq: $courseId } }) {
      profile {
        organizations {
          organization {
            name
          }
        }
      }
    }
  }
`

export default function useCourseParticipantsOrganizations(courseId: number) {
  const [{ data, error }] = useQuery<
    GetCourseParticipantsOrganizationsQuery,
    GetCourseParticipantsOrganizationsQueryVariables
  >({
    query: GET_COURSE_PARTICIPANTS_ORGANIZATIONS,
    variables: { courseId },
  })
  return { data, error }
}
