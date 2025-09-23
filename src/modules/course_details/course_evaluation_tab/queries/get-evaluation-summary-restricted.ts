import { gql } from 'graphql-request'

/*
The participant: { course_id: { _eq: $courseId } } condition will return the course evaluation
answers only if the participant is not null, that means only data of course attendees will be fetched
 */

export const GET_EVALUATIONS_SUMMARY_QUERY_RESTRICTED = gql`
  query GetEvaluationsSummaryRestricted(
    $courseId: Int!
    $profileCondition: profile_bool_exp = {}
  ) {
    answers: course_evaluation_answers(
      where: {
        courseId: { _eq: $courseId }
        profile: $profileCondition
        participant: { course_id: { _eq: $courseId } }
      }
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
