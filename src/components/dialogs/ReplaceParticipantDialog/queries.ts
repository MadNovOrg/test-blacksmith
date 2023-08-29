import { gql } from 'urql'

export const REPLACE_PARTICIPANT = gql`
  mutation ReplaceParticipant($input: ReplaceParticipantInput!) {
    replaceParticipant(input: $input) {
      success
      error
    }
  }
`
