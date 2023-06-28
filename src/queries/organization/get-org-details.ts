import { gql } from 'graphql-request'

import { CERTIFICATE_CHANGELOG, ORGANIZATION } from '@app/queries/fragments'

export const Matcher = /(query GetOrgDetails)/i

export const QUERY = gql`
  ${ORGANIZATION}
  ${CERTIFICATE_CHANGELOG}
  query GetOrgDetails(
    $where: organization_bool_exp = {}
    $certificateStatus: String_comparison_exp = { _in: "" }
  ) {
    orgs: organization(where: $where) {
      ...Organization
    }
    profiles: profile(
      where: {
        organizations: { organization: $where }
        archived: { _eq: false }
      }
    ) {
      id
      fullName
      avatar
      archived
      lastActivity
      createdAt
      certificates(where: { status: $certificateStatus }) {
        id
        courseLevel
        expiryDate
        status
        participant {
          certificateChanges(order_by: { createdAt: desc }) {
            ...CertificateChangelog
          }
        }
      }
      go1Licenses(where: { organization: $where }) {
        id
        expireDate
      }
      upcomingEnrollments {
        orgId
        orgName
        courseLevel
        courseId
      }
      organizations {
        id
        position
        isAdmin
        profile {
          fullName
          avatar
          archived
        }
        organization {
          id
          name
        }
      }
    }
    pendingInvitesCount: organization_invites_aggregate(
      where: {
        _and: [{ status: { _eq: "PENDING" } }, { organization: $where }]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`
