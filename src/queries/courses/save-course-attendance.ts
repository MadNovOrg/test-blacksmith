import { gql } from 'graphql-request'

export type ResponseType = {
  saveAttended: { affectedRows: number }
  saveNotAttended: { affectedRows: number }
}

export type ParamsType = { attended: string[]; notAttended: string[] }

export const MUTATION = gql`
  mutation SaveCourseAttendance($attended: [uuid!]!, $notAttended: [uuid!]!) {
    saveAttended: update_course_participant(
      where: { id: { _in: $attended } }
      _set: { attended: true }
    ) {
      affectedRows: affected_rows
    }

    saveNotAttended: update_course_participant(
      where: { id: { _in: $notAttended } }
      _set: { attended: false }
    ) {
      affectedRows: affected_rows
    }
  }
`
