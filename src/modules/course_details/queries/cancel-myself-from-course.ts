import { gql } from 'graphql-request'

export const CANCEL_MYSELF_FROM_COURSE_MUTATION = gql`
  mutation CancelMyselfFromCourse($courseId: Int!) {
    cancelMyselfFromCourse(courseId: $courseId)
  }
`
