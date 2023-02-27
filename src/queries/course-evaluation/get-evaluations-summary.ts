import { gql } from 'graphql-request'

import {
  CourseEvaluationQuestionGroup,
  CourseEvaluationQuestionType,
} from '@app/types'

export type ResponseType = {
  answers: {
    id: string
    profile: {
      id: string
      fullName: string
      avatar?: string
    }
    answer: string
    question: {
      questionKey: string
      type: CourseEvaluationQuestionType
      group: CourseEvaluationQuestionGroup
    }
  }[]
}

export type ParamsType = { courseId: string }

export const QUERY = gql`
  query GetEvaluationsSummary($courseId: Int!) {
    answers: course_evaluation_answers(
      where: { courseId: { _eq: $courseId } }
    ) {
      id
      profile {
        id
        fullName
        avatar
        archived
      }
      answer
      question {
        questionKey
        type
        group
      }
    }
  }
`
