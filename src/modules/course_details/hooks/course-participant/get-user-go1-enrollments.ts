import { gql } from 'urql'

export const GET_USER_GO1_ENROLLMENTS = gql`
  query GetUserGO1Enrollments($profileId: String!) {
    enrollments: getUserGO1Enrollments(profileId: $profileId) {
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
