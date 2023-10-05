import { gql } from 'graphql-request'

export const QUERY = gql`
  query GetCourseParticipantByInvite($inviteId: uuid!, $courseId: Int!) {
    course_participant(
      where: {
        _and: { invite_id: { _eq: $inviteId }, course_id: { _eq: $courseId } }
      }
    ) {
      id
    }
  }
`
