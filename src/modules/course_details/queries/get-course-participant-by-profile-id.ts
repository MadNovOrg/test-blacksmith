import { gql } from 'urql'

import { CERTIFICATE } from '@app/queries/fragments'

export const GET_PARTICIPANT = gql`
  ${CERTIFICATE}
  query GetCourseParticipantId($profileId: uuid!, $courseId: Int!) {
    course_participant(
      where: { course_id: { _eq: $courseId }, profile_id: { _eq: $profileId } }
    ) {
      attended
      certificate {
        ...Certificate
      }
      completed_evaluation
      dateGraded
      go1EnrolmentId
      go1EnrolmentStatus
      grade
      gradingModules {
        completed
        module {
          id
          moduleGroup {
            id
            name
          }
          name
        }
      }
      healthSafetyConsent
      id
      profile {
        archived
        avatar
        fullName
      }
    }
  }
`
