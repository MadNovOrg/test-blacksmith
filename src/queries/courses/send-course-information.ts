import { gql } from 'graphql-request'

export const MUTATION = gql`
  mutation sendCourseInformation($courseId: Int!, $attendeeIds: [uuid!]!) {
    sendCourseInformation(courseId: $courseId, attendeeIds: $attendeeIds) {
      success
      error
    }
  }
`
