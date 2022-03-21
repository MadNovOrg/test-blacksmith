import { gql } from 'graphql-request'

export type ResponseType = {
  answers: { id: string }[]
}

export type ParamsType = { courseId: string }

export const QUERY = gql`
  query GetEvaluation($courseId: uuid!) {
    answers: course_evaluation_answers(
      where: { courseId: { _eq: $courseId } }
    ) {
      id
    }
  }
`
