import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation SaveCourseAttendance(
    $attended: [uuid!]!
    $notAttended: [uuid!]!
    $attendedAudit: [course_participant_audit_insert_input!]!
    $notAttendedAudit: [course_participant_audit_insert_input!]!
    $courseId: Int!
    $participantProfileId: [uuid!]
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
      _set: { attended: false }
    ) {
      affectedRows: affected_rows
    }

    saveNotAttendedAudit: insert_course_participant_audit(
      objects: $notAttendedAudit
    ) {
      affectedRows: affected_rows
    }
    delete_course_evaluation_answers(
      where: {
        _and: [
          { courseId: { _eq: $courseId } }
          { profileId: { _in: $participantProfileId } }
        ]
      }
    ) {
      affected_rows
    }
  }
`
