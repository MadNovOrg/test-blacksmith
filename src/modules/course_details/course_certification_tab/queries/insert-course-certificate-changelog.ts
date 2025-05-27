import { gql } from 'urql'

export const INSERT_CERTIFICATE_CHANGELOG_MUTATION = gql`
  mutation InsertCourseCertificateChangelog(
    $participantId: uuid!
    $type: course_certificate_changelog_type_enum!
    $payload: jsonb!
  ) {
    insertChangeLog: insert_course_certificate_changelog_one(
      object: { payload: $payload, participantId: $participantId, type: $type }
    ) {
      id
    }
  }
`
