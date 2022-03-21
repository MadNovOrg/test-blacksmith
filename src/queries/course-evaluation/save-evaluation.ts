import { gql } from 'graphql-request'

export type ResponseType = {
  returning: { id: string }
}

export type ParamsType = never

export const MUTATION = gql`
  mutation SaveCourseEvaluation(
    $answers: [course_evaluation_answers_insert_input!]!
  ) {
    insert_course_evaluation_answers(objects: $answers) {
      returning {
        id
      }
    }
  }
`
