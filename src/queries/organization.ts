import { gql } from 'graphql-request'

import { PROFILE } from './fragments'

export const getOrganizationWithKeyContacts = gql`
  ${PROFILE}
  query GetOrgWithKeyContacts($id: uuid!) {
    organization: organization_by_pk(id: $id) {
      ...Organization
      members(where: { memberType: { _eq: "Key Contact" } }) {
        profile {
          ...Profile
        }
      }
    }
  }
`
