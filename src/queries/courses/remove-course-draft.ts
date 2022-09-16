import { gql } from 'graphql-request'

export const QUERY = gql`
  mutation RemoveCourseDraft($courseType: String!, $profileId: uuid!) {
    delete_course_draft(
      where: {
        profileId: { _eq: $profileId }
        courseType: { _eq: $courseType }
      }
    ) {
      returning {
        id
      }
    }
  }
`
