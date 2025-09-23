import { gql } from 'graphql-request'

export const DELETE_COURSE = gql`
  mutation DeleteCourse($courseId: Int!) {
    delete_course_audit(where: { course_id: { _eq: $courseId } }) {
      affected_rows
    }

    delete_course_participant_audit(where: { course_id: { _eq: $courseId } }) {
      affected_rows
    }

    delete_course_by_pk(id: $courseId) {
      id
      course_code
    }
  }
`
