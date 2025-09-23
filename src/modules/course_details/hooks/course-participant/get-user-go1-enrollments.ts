import { gql } from 'urql'

export const GET_USER_GO1_ENROLLMENTS = gql`
  query GetUserGO1Enrollments($email: String!) {
    enrollments: getUserGO1Enrollments(email: $email) {
      enrollments {
        id
        learningObject {
          id
          title
        }
        status
      }
    }
  }
`
