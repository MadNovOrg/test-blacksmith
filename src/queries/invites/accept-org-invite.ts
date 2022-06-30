import { gql } from 'graphql-request'

export type ResponseType = {
  invite: { id: string }
}

export type ParamsType = {
  profileId: string
}

export const MUTATION = gql`
  mutation AcceptOrgInvite($profileId: String!) {
    invite: acceptOrgInvite(profileId: $profileId) {
      id
    }
  }
`
