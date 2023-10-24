import { gql } from 'graphql-request'

export const GET_COURSE_SOURCES_QUERY = gql`
  query GetCoursesSources {
    sources: course_source {
      name
    }
  }
`
