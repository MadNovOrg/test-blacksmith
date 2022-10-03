import { gql } from 'graphql-request'

import { Go1_Licenses_History_Set_Input } from '@app/generated/graphql'

import { getClient } from '../../hasura-api'

export async function insertGo1HistoryEvent(
  event: Go1_Licenses_History_Set_Input
): Promise<{ id: string }> {
  const client = getClient()

  const mutation = gql`
    mutation InsertLicenseHistoryEvent(
      $input: go1_licenses_history_insert_input!
    ) {
      insert_go1_licenses_history_one(object: $input) {
        id
      }
    }
  `

  const response = await client.request(mutation, { input: event })

  return response?.insert_go1_licenses_history_one?.id
}
