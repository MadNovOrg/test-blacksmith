import { gql } from 'graphql-request'

import { Course_Status_Enum } from '@app/generated/graphql'

export type ResponseType = { id: string }
export type ParamsType = { id: string; status: Course_Status_Enum }

export const MUTATION = gql`
  mutation setCourseStatus($id: Int!, $status: course_status_enum!) {
    update_course_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
      id
    }
  }
`
