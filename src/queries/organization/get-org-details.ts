import { gql } from 'graphql-request'

import { ORGANIZATION } from '@app/queries/fragments'

export const Matcher = /(query GetOrgDetails)/i

export const QUERY = gql`
  ${ORGANIZATION}
  query GetOrgDetails($where: organization_bool_exp = {}) {
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
      certificates(where: { status: { _neq: "EXPIRED" } }) {
        id
        courseLevel
        expiryDate
        status
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
