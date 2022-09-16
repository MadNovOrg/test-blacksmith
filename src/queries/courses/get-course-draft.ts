import { gql } from 'graphql-request'

export const QUERY = gql`
  query GetCourseDraft($profileId: uuid!, $courseType: String!) {
    course_draft(
      where: {
        profileId: { _eq: $profileId }
        courseType: { _eq: $courseType }
      }
    ) {
      data
    }
  }
`
