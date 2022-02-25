import { gql } from 'graphql-request'

import { COURSE } from '@app/queries/fragments'
import { Course } from '@app/types'

export type ResponseType = Course
export type ParamsType = { id: string }

export const MUTATION = gql`
  ${COURSE}
  mutation submitCourse($id: uuid!) {
    update_course_by_pk(pk_columns: { id: $id }, _set: { submitted: true }) {
      ...Course
    }
  }
`
