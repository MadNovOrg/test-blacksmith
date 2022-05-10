import { gql } from 'graphql-request'

import { CERTIFICATE, CERTIFICATE_CHANGELOG } from '@app/queries/fragments'
import { CourseCertificate } from '@app/types'

export type ResponseType = {
  certificate: CourseCertificate
}

export type ParamsType = { id: string }

export const QUERY = gql`
  ${CERTIFICATE}
  ${CERTIFICATE_CHANGELOG}
  query GetCertificate($id: uuid!) {
    certificate: course_certificate_by_pk(id: $id) {
      ...Certificate
      profile {
        fullName
      }
      participant {
        id
        grade
        dateGraded
        gradingModules {
          completed
          module {
            id
            name
            moduleGroup {
              id
              name
            }
          }
        }
        course {
          id
          name
          deliveryType
        }
        certificateChanges {
          ...CertificateChangelog
          author {
            fullName
          }
        }
      }
    }
  }
`
