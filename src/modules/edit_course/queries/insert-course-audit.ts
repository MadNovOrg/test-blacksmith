import { gql } from 'graphql-request'

export const INSERT_COURSE_AUDIT = gql`
  mutation InsertCourseAudit($object: course_audit_insert_input!) {
    insert_course_audit(objects: [$object]) {
      affected_rows
    }
  }
`
