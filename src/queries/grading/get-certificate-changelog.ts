import { gql } from 'graphql-request'

import { CERTIFICATE_CHANGELOG } from '@app/queries/fragments'
import { CourseCertificateChangelog } from '@app/types'

export type ResponseType = {
  changelogs: CourseCertificateChangelog[]
}

export type ParamsType = {
  participantId: string
}

export const QUERY = gql`
  ${CERTIFICATE_CHANGELOG}
  query GetCertificateChangelogs($participantId: uuid!) {
    changelogs: course_certificate_changelog(
      where: { participantId: { _eq: $participantId } }
      order_by: { createdAt: desc }
    ) {
      ...CertificateChangelog
      author {
        fullName
      }
    }
  }
`
