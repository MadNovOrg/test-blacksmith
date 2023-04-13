import { gql } from 'graphql-request'

import { Course_Participant_Audit_Insert_Input } from '@app/generated/graphql'

export type ResponseType = {
  saveAttended: { affectedRows: number }
  saveNotAttended: { affectedRows: number }
}

type AuditEntry = Course_Participant_Audit_Insert_Input

export type ParamsType = {
  attended: string[]
  attendedAudit: AuditEntry[]
  notAttended: string[]
  notAttendedAudit: AuditEntry[]
}

export const MUTATION = gql`
  mutation SaveCourseAttendance(
    $attended: [uuid!]!,
    $notAttended: [uuid!]!,
    $attendedAudit: [course_participant_audit_insert_input!]!,
    $notAttendedAudit: [course_participant_audit_insert_input!]!
  ) {
    saveAttended: update_course_participant(
      where: { id: { _in: $attended } }
      _set: { attended: true, grade: null, dateGraded: null }
    ) {
      affectedRows: affected_rows
    }

    saveAttendedAudit: insert_course_participant_audit(
      objects: $attendedAudit
    ) {
      affectedRows: affected_rows
    }

    saveNotAttended: update_course_participant(
      where: { id: { _in: $notAttended } }
      _set: { attended: false, grade: FAIL, dateGraded: "${new Date().toISOString()}" }
    ) {
      affectedRows: affected_rows
    }

    saveNotAttendedAudit: insert_course_participant_audit(
      objects: $notAttendedAudit
    ) {
      affectedRows: affected_rows
    }
  }
`
