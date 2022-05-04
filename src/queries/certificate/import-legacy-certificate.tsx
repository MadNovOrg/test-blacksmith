import { gql } from 'graphql-request'

import { CourseLevel } from '@app/types'

export type ParamsType = {
  id: string
  number: string
  expiryDate: Date
  certificationDate: Date
  courseName: string
  courseLevel: CourseLevel
  profileId: string
}

export const MUTATION = gql`
  mutation ImportLegacyCertificate(
    $id: uuid!
    $number: String!
    $expiryDate: date!
    $certificationDate: date!
    $courseName: String!
    $courseLevel: String!
    $profileId: uuid!
  ) {
    insert_course_certificate_one(
      object: {
        id: $id
        number: $number
        expiryDate: $expiryDate
        certificationDate: $certificationDate
        courseName: $courseName
        courseLevel: $courseLevel
        profileId: $profileId
      }
    ) {
      id
    }
    update_legacy_certificate(
      where: { number: { _eq: $number } }
      _set: { courseCertificateId: $id }
    ) {
      returning {
        id
      }
    }
  }
`
