import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation RevokeCert($id: uuid!, $participantId: uuid!, $payload: jsonb!) {
    revoked: update_course_certificate_by_pk(
      pk_columns: { id: $id }
      _set: { isRevoked: true }
    ) {
      id
    }

    insertChangeLog: insert_course_certificate_changelog_one(
      object: {
        participantId: $participantId
        type: REVOKED
        payload: $payload
      }
    ) {
      id
    }
  }
`
