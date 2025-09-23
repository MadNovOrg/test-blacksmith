import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation SaveHealthSafetyConsent($courseId: Int!, $profileId: uuid!) {
    update_course_participant(
      where: {
        _and: [
          { course: { id: { _eq: $courseId } } }
          { profile: { id: { _eq: $profileId } } }
        ]
      }
      _set: { healthSafetyConsent: true }
    ) {
      returning {
        id
      }
    }
  }
`
