import { gql } from 'graphql-request'

import { ORGANIZATION } from '@app/queries/fragments'

export const Matcher = /(query GetOrgDetails)/i

export const QUERY = gql`
  ${ORGANIZATION}
  query GetOrgDetails($where: organization_bool_exp = {}) {
    orgs: organization(where: $where) {
      ...Organization
    }
    profiles: profile(where: { organizations: { organization: $where } }) {
      id
      fullName
      certificates(where: { status: { _neq: "EXPIRED" } }) {
        courseLevel
        expiryDate
        status
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
        organization {
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
