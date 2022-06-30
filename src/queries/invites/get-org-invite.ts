import { gql } from 'graphql-request'

export type ResponseType = {
  invite: {
    id: string
    orgName: string
  }
}

export type ParamsType = never

export const QUERY = gql`
  query GetOrgInvite {
    invite: getOrgInvite {
      id
      orgName
    }
  }
`
