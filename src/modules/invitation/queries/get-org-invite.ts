import { gql } from 'urql'

export const GET_ORG_INVITE_QUERY = gql`
  query GetOrgInvite {
    invite: getOrgInvite {
      id
      orgName
      orgId
    }
  }
`
