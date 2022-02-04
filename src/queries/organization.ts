import { gql } from 'graphql-request'

import { ORGANIZATION, PROFILE } from './fragments'

export const getOrganizationWithKeyContacts = gql`
  ${ORGANIZATION}
  ${PROFILE}
  query ($id: uuid!) {
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
