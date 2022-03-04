import { gql } from 'graphql-request'

import { CourseStatus } from '@app/types'

export type ResponseType = { id: string }
export type ParamsType = { id: string; status: CourseStatus }

export const MUTATION = gql`
  mutation setCourseStatus($id: uuid!, $status: course_status_enum!) {
    update_course_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
      id
    }
  }
`
