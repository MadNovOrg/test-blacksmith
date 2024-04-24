import { gql } from 'urql'

import { Grade_Enum } from '@app/generated/graphql'

export type ParamsType = {
  modules: Array<{
    course_participant_id: string
    module_id: string
    completed: boolean
  }>
  participantIds: string[]
  grade: Grade_Enum
  feedback: string
  courseId: number
}

export type ResponseType = {
  saveModules: { affectedRows: number }
  saveParticipantsGrade: { affectedRows: number }
  gradingStarted: { id: string }
}

export const SAVE_COURSE_GRADING_MUTATION = gql`
  mutation SaveCourseGrading(
    $modules: [course_participant_module_insert_input!]!
    $participantIds: [uuid!]
    $grade: grade_enum!
    $feedback: String
    $courseId: Int!
    $notes: [course_participant_note_insert_input!]!
    $evaluationSubmitted: Boolean = false
  ) {
    saveModules: insert_course_participant_module(objects: $modules) {
      affectedRows: affected_rows
    }

    saveParticipantsGrade: update_course_participant(
      where: { id: { _in: $participantIds } }
      _set: { grade: $grade, grading_feedback: $feedback, dateGraded: "${new Date().toISOString()}", completed_evaluation: $evaluationSubmitted}
    ) {
      affectedRows: affected_rows
    }

    gradingStarted: update_course_by_pk(
      pk_columns: { id: $courseId }
      _set: { gradingStarted: true }
    ) {
      id
    }

    insert_course_participant_note(objects: $notes) {
      affected_rows
    }
  }
`
