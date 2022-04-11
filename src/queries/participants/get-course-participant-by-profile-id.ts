import { gql } from 'graphql-request'

export const GetParticipant = gql`
  query GetCourseParticipantId($profileId: uuid!, $courseId: Int!) {
    course_participant(
      where: { course_id: { _eq: $courseId }, profile_id: { _eq: $profileId } }
    ) {
      profile {
        fullName
      }
      id
      grade
      dateGraded
      gradingModules {
        completed
        module {
          id
          name
          moduleGroup {
            id
            name
          }
        }
      }
      certificate {
        number
        expiryDate
      }
    }
  }
`
