import { gql } from 'urql'

export const REJECT_COURSE_MUTATION = gql`
  mutation RejectCourse($input: RejectCourseInput!) {
    rejectCourse(input: $input) {
      success
    }
  }
`
