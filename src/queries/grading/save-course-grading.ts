import { gql } from 'graphql-request'

import { Grade } from '@app/types'

export type ParamsType = {
  modules: Array<{
    course_participant_id: string
    module_id: string
    completed: boolean
  }>
  participantIds: string[]
  grade: Grade
  feedback: string
  courseId: number
}

export type ResponseType = {
  saveModules: { affectedRows: number }
  saveParticipantsGrade: { affectedRows: number }
  gradingStarted: { id: string }
}

export const MUTATION = gql`
  mutation SaveCourseGrading(
    $modules: [course_participant_module_insert_input!]!
    $participantIds: [uuid!]
    $grade: grade_enum!
    $feedback: String
    $courseId: Int!
  ) {
    saveModules: insert_course_participant_module(objects: $modules) {
      affectedRows: affected_rows
    }

    saveParticipantsGrade: update_course_participant(
      where: { id: { _in: $participantIds } }
      _set: { grade: $grade, grading_feedback: $feedback, dateGraded: "${new Date().toISOString()}" }
    ) {
      affectedRows: affected_rows
    }

  gradingStarted: update_course_by_pk(
    pk_columns: { id: $courseId }
    _set: { gradingStarted: true }
  ) {
    id
  }
}
`
