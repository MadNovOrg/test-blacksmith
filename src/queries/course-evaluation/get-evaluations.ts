import { gql } from 'graphql-request'

export const QUERY = gql`
  query GetEvaluations($courseId: Int!) {
    evaluations: course_evaluation_answers(
      where: { courseId: { _eq: $courseId } }
      distinct_on: profileId
    ) {
      id
      profile {
        id
        fullName
        email
        organizations {
          organization {
            name
          }
        }
      }
    }

    attendees: course_participant(
      where: { course_id: { _eq: $courseId }, attended: { _eq: true } }
    ) {
      id
      profile {
        id
      }
    }

    trainers: course_trainer(
      where: { course_id: { _eq: $courseId }, status: { _eq: ACCEPTED } }
    ) {
      id
      type
      profile {
        id
      }
    }
  }
`
