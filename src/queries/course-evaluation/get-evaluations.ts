import { gql } from 'graphql-request'

export type ResponseType = {
  evaluations: {
    id: string
    profile: {
      id: string
      fullName: string
      email: string
      organizations: {
        organization: {
          name: string
        }
      }[]
    }
  }[]
  courseParticipantsAggregation: {
    aggregate: {
      count: number
    }
  }
}

export type ParamsType = { courseId: string }

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

    courseParticipantsAggregation: course_participant_aggregate(
      where: { course_id: { _eq: $courseId } }
    ) {
      aggregate {
        count
      }
    }
  }
`
