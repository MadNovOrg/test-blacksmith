import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation RejectCourse($input: RejectCourseInput!) {
    rejectCourse(input: $input) {
      success
    }
  }
`
