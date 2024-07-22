import { gql } from 'urql'

export type ResponseType = {
  invite: {
    id: string
    orgName: string
    orgId: string
  }
}

export type ParamsType = never

export const GET_ORG_INVITE_QUERY = gql`
  query GetOrgInvite {
    invite: getOrgInvite {
      id
      orgName
      orgId
    }
  }
`
