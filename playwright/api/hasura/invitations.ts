import { gql } from 'graphql-request'

import { getClient } from './client'

export const deleteCourseInvitation = async (id: string): Promise<string> => {
  const query = gql`query MyQuery { delete_course_invites_by_pk(id: "${id}") { id }}`
  const response: { data: { delete_course_invites_by_pk: { id: string } } } =
    await getClient().request(query)
  return response.data.delete_course_invites_by_pk.id
}
