import { gql } from 'graphql-request'

export type ResponseType = {
  insertCourseParticipant: { id: string }
}

export type ParamsType = {
  courseId: string
  inviteId: string
}

export const MUTATION = gql`
  mutation InsertCourseParticipant($courseId: uuid!, $inviteId: uuid!) {
    insertCourseParticipant: insert_course_participant_one(
      object: { course_id: $courseId, invite_id: $inviteId }
    ) {
      id
    }
  }
`
