import { gql } from 'urql'

export const SAVE_ORGANISATION_INVITES_MUTATION = gql`
  mutation SaveOrganisationInvites($invites: [SaveOrgInviteInput!]!) {
    saveOrgInvites(invites: $invites) {
      error
      success
    }
  }
`
