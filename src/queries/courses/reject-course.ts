import { gql } from 'urql'

export const REJECT_COURSE_MUTATION = gql`
  mutation RejectCourse(
    $input: RejectCourseInput!
    $object: course_audit_insert_input!
  ) {
    rejectCourse(input: $input) {
      success
    }
    insert_course_audit(objects: [$object]) {
      affected_rows
    }
  }
`
