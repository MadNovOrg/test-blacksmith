import { gql } from 'urql'

export const GET_COURSE_EVALUATION_QUESTIONS_QUERY = gql`
  query GetCourseEvaluationQuestions {
    questions: course_evaluation_questions(
      order_by: { group: asc, displayOrder: asc }
    ) {
      id
      type
      questionKey
      group
      displayOrder
      required
    }
  }
`
