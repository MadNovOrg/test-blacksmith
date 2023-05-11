import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation SaveCourseModulesBild($courseId: Int!, $modules: jsonb!) {
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
  }
`
