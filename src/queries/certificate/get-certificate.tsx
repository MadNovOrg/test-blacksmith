import { gql } from 'graphql-request'

import { CERTIFICATE, CERTIFICATE_CHANGELOG } from '@app/queries/fragments'

export type ParamsType = { id: string }

export const QUERY = gql`
  ${CERTIFICATE}
  ${CERTIFICATE_CHANGELOG}
  query GetCertificate($id: uuid!) {
    certificateHoldRequest: course_certificate_hold_request(
      where: { certificate_id: { _eq: $id } }
    ) {
      expiry_date
      start_date
    }
    certificate: course_certificate_by_pk(id: $id) {
      ...Certificate
      profile {
        fullName
        id
        avatar
        archived
      }
      participant {
        id
        grade
        dateGraded
        profile {
          fullName
          avatar
          archived
        }
        gradingModules {
          completed
          id
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
          level
          deliveryType
        }
        certificateChanges(order_by: { createdAt: desc }) {
          ...CertificateChangelog
          author {
            fullName
            avatar
            archived
          }
        }
      }
    }
  }
`
