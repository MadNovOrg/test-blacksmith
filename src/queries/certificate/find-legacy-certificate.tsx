import { gql } from 'graphql-request'

import { LEGACY_CERTIFICATE } from '@app/queries/fragments'
import { LegacyCertificate } from '@app/types'

export type ResponseType = {
  results: LegacyCertificate[]
}

export type ParamsType = { code: string; firstName: string; lastName: string }

export const QUERY = gql`
  ${LEGACY_CERTIFICATE}
  query FindLegacyCertificate(
    $code: String!
    $firstName: String!
    $lastName: String!
  ) {
    results: legacy_certificate(
      where: {
        _and: {
          number: { _eq: $code }
          firstName: { _eq: $firstName }
          lastName: { _eq: $lastName }
          courseCertificateId: { _is_null: true }
        }
      }
    ) {
      ...LegacyCertificate
    }
  }
`
