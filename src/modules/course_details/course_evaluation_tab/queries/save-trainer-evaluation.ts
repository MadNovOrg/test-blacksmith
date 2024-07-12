import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation SaveTrainerCourseEvaluation(
    $answers: [course_evaluation_answers_insert_input!]!
  ) {
    inserted: insert_course_evaluation_answers(objects: $answers) {
      rows: returning {
        id
      }
    }
  }
`
