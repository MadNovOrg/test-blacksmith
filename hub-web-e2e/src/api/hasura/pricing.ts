import { gql } from 'graphql-request'

import {
  DeletePrigingScheduleMutation,
  DeletePrigingScheduleMutationVariables,
} from '@qa/generated/graphql'

import { getClient } from './client'

const client = getClient()
export const deletePricingSchedule = async (id: string) => {
  const mutation = gql`
    mutation DeletePrigingSchedule($id: uuid) {
      delete_course_pricing_schedule(where: { id: { _eq: $id } }) {
        affected_rows
      }
    }
  `
  try {
    const response = await client.request<
      DeletePrigingScheduleMutation,
      DeletePrigingScheduleMutationVariables
    >(mutation, { id })
    console.log(`Deleted pricing with id: ${id}`)
    return response.delete_course_pricing_schedule?.affected_rows
  } catch (error) {
    throw new Error(`Failed to delete pricing: ${error}`)
  }
}
