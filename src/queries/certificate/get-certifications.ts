import { gql } from 'graphql-request'

import {
  CERTIFICATE,
  CERTIFICATE_CHANGELOG,
  COURSE,
} from '@app/queries/fragments'

export const Matcher = /query GetCertifications/i

export const GET_CERTIFICATIONS = gql`
  ${COURSE}
  ${CERTIFICATE}
  ${CERTIFICATE_CHANGELOG}
  query GetCertifications(
    $limit: Int
    $offset: Int
    $orderBy: [course_certificate_order_by!] = { profile: { fullName: asc } }
    $where: course_certificate_bool_exp = {}
  ) {
    certifications: course_certificate(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      ...Certificate
      profile {
        id
        fullName
        avatar
        archived
        email
        contactDetails
        organizations {
          organization {
            id
            name
          }
        }
      }
      participant {
        id
        attended
        invoiceID
        bookingDate
        go1EnrolmentStatus
        go1EnrolmentProgress
        grade
        healthSafetyConsent

        certificateChanges(order_by: { createdAt: desc }) {
          ...CertificateChangelog
        }
      }

      course {
        ...Course
        accreditedBy
        bildStrategies {
          id
          strategyName
        }
        organization {
          name
          id
        }
      }
    }
    certificationsAggregation: course_certificate_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
