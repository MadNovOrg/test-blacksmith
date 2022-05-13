import { gql } from 'graphql-request'

import { CERTIFICATE } from '../fragments'

export const GetParticipant = gql`
  ${CERTIFICATE}
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
      attended
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
        ...Certificate
      }
    }
  }
`
