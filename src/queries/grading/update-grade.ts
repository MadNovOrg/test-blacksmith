import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation UpdateGrade(
    $participantId: uuid!
    $newGrade: grade_enum!
    $type: course_certificate_changelog_type_enum!
    $payload: jsonb
  ) {
    updateCourseParticipant: update_course_participant_by_pk(
      pk_columns: { id: $participantId }
      _set: { grade: $newGrade }
    ) {
      id
    }
    insertChangeLog: insert_course_certificate_changelog_one(
      object: { payload: $payload, participantId: $participantId, type: $type }
    ) {
      id
    }
  }
`
