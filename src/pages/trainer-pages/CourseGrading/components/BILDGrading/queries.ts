import { gql } from 'urql'

export const SAVE_BILD_GRADE_MUTATION = gql`
  mutation SaveBildGrade(
    $modules: [course_participant_bild_module_insert_input!]!
    $participantIds: [uuid!]
    $grade: grade_enum!
    $feedback: String
    $courseId: Int!
  ) {
    saveModules: insert_course_participant_bild_module(objects: $modules) {
      affected_rows
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
