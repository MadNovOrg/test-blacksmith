import { gql } from 'graphql-request'

export type ParamsType = { courseId: string; email: string }
export type ResponseType = { acceptInvite: { returning: [{ id: string }] } }

export const MUTATION = gql`
  mutation UpdateCourseInvite($courseId: uuid!, $email: String!) {
    acceptInvite: update_course_invites(
      where: { course_id: { _eq: $courseId }, email: { _eq: $email } }
      _set: { status: ACCEPTED }
    ) {
      returning {
        id
      }
    }
  }
`
