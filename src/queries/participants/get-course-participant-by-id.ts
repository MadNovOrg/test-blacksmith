import { gql } from 'graphql-request'

import { CourseParticipant } from '@app/types'

import { CERTIFICATE } from '../fragments'

export type ParamsType = { id: string }
export type ResponseType = { participant: CourseParticipant }

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
      certificate {
        ...Certificate
      }
    }
  }
`
