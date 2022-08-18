import { gql } from 'graphql-request'

import { CERTIFICATE, PROFILE } from '@app/queries/fragments'

export const QUERY = gql`
  ${PROFILE}
  ${CERTIFICATE}
  query GetProfileDetails($profileId: uuid!) {
    profile: profile_by_pk(id: $profileId) {
      ...Profile
    }
    certificates: course_certificate(
      where: { profileId: { _eq: $profileId } }
      order_by: { expiryDate: desc }
    ) {
      ...Certificate
      participant {
        grade
      }
    }
    upcomingCourses: course(
      where: {
        participants: {
          _and: [
            { profile_id: { _eq: $profileId } }
            { grade: { _is_null: true } }
          ]
        }
      }
    ) {
      id
      level
    }
  }
`
