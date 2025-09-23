import { gql } from 'urql'

export type ResponseType = {
  deleted: {
    count: number
  }
  inserted: {
    count: number
  }
}

export type ParamsType = {
  courseId: string
  modules: { courseId: string; moduleId: string }[]
}

export const SAVE_COURSE_MODULES = gql`
  mutation SaveCourseModules(
    $courseId: Int!
    $modules: [course_module_insert_input!]!
  ) {
    deleted: delete_course_module(where: { courseId: { _eq: $courseId } }) {
      count: affected_rows
    }
    inserted: insert_course_module(objects: $modules) {
      count: affected_rows
    }
  }
`
