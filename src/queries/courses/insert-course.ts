import { gql } from 'urql'

export const MUTATION = gql`
  mutation InsertCourse($course: course_insert_input!) {
    insertCourse: insert_course_one(object: $course) {
      id
      course_code
      orders {
        order {
          id
        }
      }
      expenses {
        id
      }
    }
  }
`
