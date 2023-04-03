import { gql } from 'graphql-request'

import { Go1_Licenses_History_Set_Input } from '@app/generated/graphql'
import { Go1_Licenses_Insert_Input } from '@app/generated/graphql'

import { getClient } from './client'

export async function insertGo1HistoryEvent(
  event: Go1_Licenses_History_Set_Input
): Promise<{ id: string }> {
  const mutation = gql`
    mutation InsertLicenseHistoryEvent(
      $input: go1_licenses_history_insert_input!
    ) {
      insert_go1_licenses_history_one(object: $input) {
        id
      }
    }
  `
  const response: { insert_go1_licenses_history_one: { id: string } } =
    await getClient().request(mutation, { input: event })
  return { id: response?.insert_go1_licenses_history_one?.id }
}

export async function insertGo1License(input: Go1_Licenses_Insert_Input) {
  const mutation = gql`
    mutation InsertGo1License($input: go1_licenses_insert_input!) {
      insert_go1_licenses_one(object: $input) {
        id
      }
    }
  `
  const response: { insert_go1_licenses_one: { id: string } } =
    await getClient().request(mutation, { input })
  return response?.insert_go1_licenses_one?.id
}

export async function deleteGo1License(id: string): Promise<boolean> {
  const mutation = gql`
    mutation DeleteGo1License($id: uuid!) {
      delete_go1_licenses_by_pk(id: $id) {
        id
      }
    }
  `
  const response: { delete_go1_licenses_by_pk: { id: boolean } } =
    await getClient().request(mutation, { id })
  return response?.delete_go1_licenses_by_pk?.id
}
