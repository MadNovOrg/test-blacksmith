import { gql } from 'graphql-request'

export type ResponseType = {
  evaluations: {
    id: string
    profileId: string
    profile: {
      fullName: string
      email: string
      organizations: {
        organization: {
          name: string
        }
      }[]
    }
  }[]
}

export type ParamsType = { courseId: string; profileId: string }

export const QUERY = gql`
  query GetEvaluations($courseId: uuid!, $profileId: uuid!) {
    evaluations: course_evaluation_answers(
      where: { courseId: { _eq: $courseId }, profileId: { _neq: $profileId } }
      distinct_on: profileId
    ) {
      id
      profileId
      profile {
        fullName
        email
        organizations {
          organization {
            name
          }
        }
      }
    }
  }
`
