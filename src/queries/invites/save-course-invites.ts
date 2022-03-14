import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation SaveCourseInvites($invites: [course_invites_insert_input!]!) {
    insert_course_invites(objects: $invites) {
      returning {
        id
      }
    }
  }
`
