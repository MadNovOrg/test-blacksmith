import { gql } from 'graphql-request'

import { CourseEvaluationQuestion } from '@app/types'

export type ResponseType = {
  questions: CourseEvaluationQuestion[]
}

export type ParamsType = never

export const QUERY = gql`
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
