import { gql } from 'graphql-request'

import { CERTIFICATE } from '@app/queries/fragments'
import { Course, CourseCertificate } from '@app/types'

export type ResponseType = {
  certificates: CourseCertificate[]
  upcomingCourses: Course[]
}

export type ParamsType = {
  profileId: string
}

export const QUERY = gql`
  ${CERTIFICATE}
  query GetProfileCertifications($profileId: uuid!) {
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
