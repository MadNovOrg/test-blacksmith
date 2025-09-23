import { gql } from 'graphql-request'

export type ResponseType = {
  saveCovered: { affectedRows: number }
  saveNotCovered: { affectedRows: number }
  gradingConfirmed: { id: string }
}

export type ParamsType = {
  coveredModules: string[]
  notCoveredModules: string[]
  courseId: string
}

export const SAVE_COURSE_MODULES_SELECTION = gql`
  mutation SaveModuleSelection(
    $coveredModules: [uuid!]!
    $notCoveredModules: [uuid!]!
    $courseId: Int!
  ) {
    saveCovered: update_course_module(
      where: {
        moduleId: { _in: $coveredModules }
        courseId: { _eq: $courseId }
      }
      _set: { covered: true }
    ) {
      affectedRows: affected_rows
    }

    saveNotCovered: update_course_module(
      where: {
        moduleId: { _in: $notCoveredModules }
        courseId: { _eq: $courseId }
      }
      _set: { covered: false }
    ) {
      affectedRows: affected_rows
    }

    gradingConfirmed: update_course_by_pk(
      pk_columns: { id: $courseId }
      _set: { gradingConfirmed: true }
    ) {
      id
    }
  }
`
