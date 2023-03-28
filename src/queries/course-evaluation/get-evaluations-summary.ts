import { gql } from 'graphql-request'

import { Profile_Bool_Exp } from '@app/generated/graphql'
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
      archived?: boolean
    }
    answer: string
    question: {
      questionKey: string
      type: CourseEvaluationQuestionType
      group: CourseEvaluationQuestionGroup
    }
  }[]
}

export type ParamsType = {
  courseId: string
  profileCondition?: Profile_Bool_Exp
}

export const QUERY = gql`
  query GetEvaluationsSummary(
    $courseId: Int!
    $profileCondition: profile_bool_exp = {}
  ) {
    answers: course_evaluation_answers(
      where: { courseId: { _eq: $courseId }, profile: $profileCondition }
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
