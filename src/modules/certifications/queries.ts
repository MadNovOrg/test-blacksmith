import { gql } from 'urql'

export const UPSERT_CERTIFICATION = gql`
  mutation UpsertCertification($participantIds: [uuid!], $gradedOn: jsonb!) {
    update_course_participant(
      where: { id: { _in: $participantIds } }
      _set: { gradedOn: $gradedOn }
    ) {
      affected_rows
    }
  }
`
