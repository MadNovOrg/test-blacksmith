import { gql } from 'graphql-request'

export const QUERY = gql`
  query GetEvaluations(
    $courseId: Int!
    $profileCondition: profile_bool_exp = {}
  ) {
    evaluations: course_evaluation_answers(
      where: { courseId: { _eq: $courseId }, profile: $profileCondition }
      distinct_on: profileId
    ) {
      id
      profile {
        id
        fullName
        avatar
        archived
        email
        organizations {
          organization {
            name
          }
        }
      }
    }

    attendees: course_participant(
      where: {
        course_id: { _eq: $courseId }
        attended: { _eq: true }
        profile: $profileCondition
      }
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
