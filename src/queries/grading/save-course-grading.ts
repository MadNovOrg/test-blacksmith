import { gql } from 'graphql-request'

import { Grade } from '@app/types'

export type ParamsType = {
  participantGrades: Array<{
    course_participant_id: string
    module_id: string
    grade: Grade
    feedback?: string
  }>
  participantIds: string[]
}

export type ResponseType = {
  saveGrades: { affectedRows: number }
  saveParticipantsGraded: { affectedRows: number }
}

export const MUTATION = gql`
  mutation SaveCourseGrading(
    $participantGrades: [course_participant_grading_insert_input!]!
    $participantIds: [uuid!]
  ) {
    saveGrades: insert_course_participant_grading(objects: $participantGrades) {
      affectedRows: affected_rows
    }

    saveParticipantsGraded: update_course_participant(
      where: { id: { _in: $participantIds } }
      _set: { graded: true }
    ) {
      affectedRows: affected_rows
    }
  }
`
