import { gql } from 'urql'

// TODO: Use insert_course_one instead of insert_course
export const MUTATION = gql`
  mutation InsertCourse($course: course_insert_input!) {
    insertCourse: insert_course(objects: [$course]) {
      affectedRows: affected_rows
      inserted: returning {
        id
        course_code
        orders {
          id
        }
        expenses {
          id
        }
      }
    }
  }
`
