import { gql } from 'graphql-request'

import { CERTIFICATE } from '../fragments'

export const QUERY = gql`
  ${CERTIFICATE}
  query CourseParticipant($id: uuid!) {
    participant: course_participant_by_pk(id: $id) {
      id
      attended
      course {
        id
        name
        level
        deliveryType
        accreditedBy
      }
      profile {
        fullName
        avatar
        archived
        email
        contactDetails
        organizations {
          organization {
            id
            name
          }
        }
      }
      grade
      dateGraded
      gradingModules {
        id
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
      bildGradingModules {
        id
        modules
      }
      certificate {
        ...Certificate
      }
      notes {
        moduleGroupId
        note
      }
    }
  }
`
