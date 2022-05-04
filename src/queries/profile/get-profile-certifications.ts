import { gql } from 'graphql-request'

import { CERTIFICATE } from '@app/queries/fragments'
import { CourseCertificate } from '@app/types'

export type ResponseType = { certificates: CourseCertificate[] }

export type ParamsType = { where: { profile: { id: { _eq: string } } } }

export const QUERY = gql`
  ${CERTIFICATE}
  query GetProfileCertifications($where: course_certificate_bool_exp!) {
    certificates: course_certificate(
      where: $where
      order_by: { expiryDate: desc }
    ) {
      ...Certificate
      participant {
        grade
      }
    }
  }
`
