import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation UndoRevokeCert($id: uuid!, $participantId: uuid!) {
    undoRevoked: update_course_certificate_by_pk(
      pk_columns: { id: $id }
      _set: { isRevoked: false }
    ) {
      id
    }

    insertChangeLog: insert_course_certificate_changelog_one(
      object: { participantId: $participantId, type: UNREVOKED }
    ) {
      id
    }
  }
`
