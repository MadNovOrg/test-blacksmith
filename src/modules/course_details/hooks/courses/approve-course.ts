import { gql } from 'urql'

export const APPROVE_COURSE_MUTATION = gql`
  mutation ApproveCourse($input: ApproveCourseInput!) {
    approveCourse(input: $input) {
      success
    }
  }
`
