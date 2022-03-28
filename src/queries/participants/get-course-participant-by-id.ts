import { gql } from 'graphql-request'

import { CourseParticipant } from '@app/types'

export type ParamsType = { id: string }
export type ResponseType = { participant: CourseParticipant }

export const QUERY = gql`
  query CourseParticipant($id: uuid!) {
    participant: course_participant_by_pk(id: $id) {
      id
      attended
      course {
        id
        name
      }
      profile {
        fullName
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
    }
  }
`
