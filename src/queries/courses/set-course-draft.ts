import { gql } from 'graphql-request'

export const QUERY = gql`
  mutation SetCourseDraft(
    $courseType: String!
    $profileId: uuid!
    $data: jsonb!
  ) {
    insert_course_draft_one(
      object: { profileId: $profileId, courseType: $courseType, data: $data }
      on_conflict: {
        constraint: course_draft_profile_id_course_type_key
        update_columns: data
      }
    ) {
      id
    }
  }
`
