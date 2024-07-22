import { gql } from 'graphql-request'

export type ResponseType = {
  invite: { id: string }
}

export type ParamsType = {
  profileId: string
}

export const ACCEPT_ORG_INVITE_MUTATION = gql`
  mutation AcceptOrgInvite($profileId: String!) {
    invite: acceptOrgInvite(profileId: $profileId) {
      id
    }
  }
`
