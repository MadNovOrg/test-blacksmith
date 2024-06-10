import { gql } from 'urql'

export const QUERY = gql`
  query GetEvaluation($courseId: Int!, $profileId: uuid!) {
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
      profile {
        fullName
        avatar
        archived
      }
      answer
    }
  }
`
