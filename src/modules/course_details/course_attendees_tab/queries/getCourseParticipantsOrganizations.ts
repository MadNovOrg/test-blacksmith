import { gql } from 'graphql-request'

export const GET_COURSE_PARTICIPANTS_ORGANIZATIONS = gql`
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
