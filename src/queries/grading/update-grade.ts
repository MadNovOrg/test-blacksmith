import { gql } from 'graphql-request'

import { Grade } from '@app/types'

export type ParamsType = {
  participantId: string
  oldGrade: Grade
  newGrade: Grade
  note: string
  authorId: string
}

export const MUTATION = gql`
  mutation UpdateGrade(
    $participantId: uuid!
    $oldGrade: grade_enum!
    $newGrade: grade_enum!
    $note: String!
    $authorId: uuid!
  ) {
    updateCourseParticipant: update_course_participant_by_pk(
      pk_columns: { id: $participantId }
      _set: { grade: $newGrade }
    ) {
      id
    }
    insertChangeLog: insert_course_certificate_changelog_one(
      object: {
        oldGrade: $oldGrade
        newGrade: $newGrade
        notes: $note
        participantId: $participantId
        authorId: $authorId
      }
    ) {
      id
    }
  }
`
