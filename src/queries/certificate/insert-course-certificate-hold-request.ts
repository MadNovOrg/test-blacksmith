import { gql } from 'graphql-request'

export const INSERT_CERTIFICATE_HOLD_MUTATION = gql`
  mutation InsertCourseCertificateHoldRequest(
    $certificateId: uuid!
    $changelogId: uuid!
    $expireDate: date!
    $startDate: date!
  ) {
    insert_course_certificate_hold_request_one(
      object: {
        certificate_id: $certificateId
        changelog_id: $changelogId
        expiry_date: $expireDate
        start_date: $startDate
      }
      on_conflict: {
        constraint: course_certificate_hold_request_certificate_id_key
        update_columns: [expiry_date, changelog_id]
      }
    ) {
      id
    }
  }
`
