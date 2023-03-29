import { gql } from 'graphql-request'

export type ResponseType = {
  inserted: { rows: { id: string }[] }
}

export type ParamsType = never

export const MUTATION = gql`
  mutation SaveCourseEvaluation(
    $answers: [course_evaluation_answers_insert_input!]!
    $id: uuid!
    $completedEvaluation: Boolean
  ) {
    inserted: insert_course_evaluation_answers(objects: $answers) {
      rows: returning {
        id
      }
    }
    update_course_participant_by_pk(
      pk_columns: { id: $id }
      _set: { completed_evaluation: $completedEvaluation }
    ) {
      completed_evaluation
    }
  }
`
