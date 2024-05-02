import { gql } from 'graphql-request'

import {
  GetInviteByEmailQuery,
  GetInviteByEmailQueryVariables,
} from '@qa/generated/graphql'

import { getClient } from './client'

export const getInviteId = async (
  courseId: number,
  email: string
): Promise<string> => {
  const query = gql`
    query GetInviteByEmail($courseId: Int!, $email: String!) {
      course_invites(
        where: { course_id: { _eq: $courseId }, email: { _eq: $email } }
      ) {
        id
      }
    }
  `

  const response = await getClient().request<
    GetInviteByEmailQuery,
    GetInviteByEmailQueryVariables
  >(query, { courseId, email })

  return response.course_invites[0].id
}
