import { gql } from 'graphql-request'

import { Base, CourseCertificate, Grade } from '@app/types'

export type ParamsType = {
  modules: Array<{
    course_participant_id: string
    module_id: string
    completed: boolean
  }>
  certificates: Array<Omit<CourseCertificate, keyof Base>>
  participantIds: string[]
  grade: Grade
  feedback: string
}

export type ResponseType = {
  saveModules: { affectedRows: number }
  saveParticipantsGrade: { affectedRows: number }
  insertCertificates: { affectedRows: number }
}

export const MUTATION = gql`
  mutation SaveCourseGrading(
    $modules: [course_participant_module_insert_input!]!
    $certificates: [course_certificate_insert_input!]!
    $participantIds: [uuid!]
    $grade: grade_enum!
    $feedback: String
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

    insertCertificates: insert_course_certificate(objects: $certificates) {
      rows: affected_rows
    }
  }
`
