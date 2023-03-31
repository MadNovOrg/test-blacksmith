import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation ApproveCourse($courseId: Int!) {
    approveCourse(courseId: $courseId) {
      success
    }
  }
`
