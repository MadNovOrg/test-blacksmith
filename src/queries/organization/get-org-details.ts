import { gql } from 'graphql-request'

import { ORGANIZATION } from '@app/queries/fragments'
import { Organization } from '@app/types'

export type ResponseType = {
  org: Organization & {
    usersCount: {
      aggregate: {
        count: number
      }
    }
  }
  activeCertificates: { aggregate: { count: number } }
  expiredCertificates: { aggregate: { count: number } }
}

export type ParamsType = {
  orgId: string
}

export const QUERY = gql`
  ${ORGANIZATION}
  query GetOrgDetails($orgId: uuid!) {
    org: organization_by_pk(id: $orgId) {
      ...Organization
      usersCount: members_aggregate {
        aggregate {
          count
        }
      }
    }
    activeCertificates: course_certificate_aggregate(
      where: {
        _and: [
          { profile: { organizations: { organization_id: { _eq: $orgId } } } }
          { expiryDate: { _gt: "now()" } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
    expiredCertificates: course_certificate_aggregate(
      where: {
        _and: [
          { profile: { organizations: { organization_id: { _eq: $orgId } } } }
          { expiryDate: { _lt: "now()" } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`
