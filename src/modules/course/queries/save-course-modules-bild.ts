import { gql } from 'graphql-request'

export const SAVE_COURSE_MODULES_BILD = gql`
  mutation SaveCourseModulesBild(
    $courseId: Int!
    $modules: jsonb!
    $duration: Int!
    $status: course_status_enum
  ) {
    deleted: delete_course_bild_module(
      where: { course_id: { _eq: $courseId } }
    ) {
      count: affected_rows
    }

    inserted: insert_course_bild_module(
      objects: [{ course_id: $courseId, modules: $modules }]
    ) {
      count: affected_rows
    }

    course: update_course_by_pk(
      pk_columns: { id: $courseId }
      _set: { modulesDuration: $duration, status: $status }
    ) {
      id
    }
  }
`
