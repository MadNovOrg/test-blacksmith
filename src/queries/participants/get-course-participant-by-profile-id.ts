import { gql } from 'urql'

import { CERTIFICATE } from '../fragments'

export const GetParticipant = gql`
  ${CERTIFICATE}
  query GetCourseParticipantId($profileId: uuid!, $courseId: Int!) {
    course_participant(
      where: { course_id: { _eq: $courseId }, profile_id: { _eq: $profileId } }
    ) {
      profile {
        fullName
        avatar
        archived
      }
      id
      completed_evaluation
      grade
      dateGraded
      attended
      healthSafetyConsent
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
