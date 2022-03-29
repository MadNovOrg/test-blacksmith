import { gql } from 'graphql-request'

import { CourseEvaluationQuestionType } from '@app/types'

export type ResponseType = {
  answers: {
    id: string
    question: { id: string; type: CourseEvaluationQuestionType }
    answer: string
  }[]
}

export type ParamsType = { courseId: string; profileId: string }

export const QUERY = gql`
  query GetEvaluation($courseId: uuid!, $profileId: uuid!) {
    answers: course_evaluation_answers(
      where: {
        _and: { profileId: { _eq: $profileId }, courseId: { _eq: $courseId } }
      }
    ) {
      id
      question {
        id
        type
      }
      answer
    }
  }
`
