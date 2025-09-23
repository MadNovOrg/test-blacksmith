import { gql } from 'urql'

import { CERTIFICATE } from '@app/queries/fragments'

export const GET_PARTICIPANT_FOR_TRANSFER = gql`
  ${CERTIFICATE}
  query GetCourseParticipantForTransfer($profileId: uuid!, $courseId: Int!) {
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
