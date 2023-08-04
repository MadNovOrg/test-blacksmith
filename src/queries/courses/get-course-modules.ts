import { gql } from 'graphql-request'

import { CourseModule } from '@app/types'

export type ResponseType = { courseModules: CourseModule[] }

export type ParamsType = { id: string }

export const QUERY = gql`
  query CourseModules($id: Int!) {
    courseModules: course_module(
      where: { courseId: { _eq: $id } }
      order_by: { module: { moduleGroup: { mandatory: desc, name: asc } } }
    ) {
      id
      covered
      module {
        id
        name
        moduleGroup {
          id
          name
          mandatory
        }
      }
    }
  }
`
