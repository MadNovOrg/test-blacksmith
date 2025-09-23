import { gql } from 'graphql-request'

export const GET_EVALUATIONS_SUMMARY_QUERY = gql`
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
