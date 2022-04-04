import { gql } from 'graphql-request'

export type ResponseType = {
  users: {
    profile: { id: string; fullName: string }
  }[]
}

export type ParamsType = { courseId: string }

export const QUERY = gql`
  query GetFeedbackUsers($courseId: uuid!) {
    users: course_evaluation_answers(
      where: { _and: { courseId: { _eq: $courseId } } }
      distinct_on: profileId
    ) {
      profile {
        id
        fullName
      }
    }
  }
`
