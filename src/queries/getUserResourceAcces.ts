import { gql } from 'urql'

export const GET_USER_CAN_ACCESS_RESOURCES = gql`
  query GetUserCanAccessResources($profileId: uuid) {
    certificates: course_certificate_aggregate(
      where: {
        _and: {
          profileId: { _eq: $profileId }
          isRevoked: { _eq: false }
          status: { _nin: ["EXPIRED_RECENTLY", "EXPIRED"] }
        }
      }
    ) {
      aggregate {
        count
      }
    }
    participant: course_participant_aggregate(
      where: { profile_id: { _eq: $profileId } }
    ) {
      aggregate {
        count
      }
    }
  }
`
