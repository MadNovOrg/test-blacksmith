import { gql } from 'urql'

export const APPROVE_COURSE_MUTATION = gql`
  mutation ApproveCourse(
    $input: ApproveCourseInput!
    $object: course_audit_insert_input!
  ) {
    approveCourse(input: $input) {
      success
    }
    insert_course_audit(objects: [$object]) {
      affected_rows
    }
  }
`
