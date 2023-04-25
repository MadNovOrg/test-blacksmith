import { gql } from 'graphql-request'

import {
  Organization_Bool_Exp,
  Organization_Insert_Input,
  Organization_Member_Insert_Input,
} from '@app/generated/graphql'

import { getClient } from './client'

export const getOrganizationId = async (name: string): Promise<string> => {
  const query = gql`query MyQuery { organization(where: {name: {_eq: "${name}"}}) { id }}`
  const response: { organization: { id: string }[] } =
    await getClient().request(query)
  return response.organization[0].id
}

export async function insertOrganization(
  input: Organization_Insert_Input
): Promise<string> {
  const mutation = gql`
    mutation InsertOrganization($object: organization_insert_input!) {
      insert_organization_one(object: $object) {
        id
      }
    }
  `
  const response: { insert_organization_one: { id: string } } =
    await getClient().request(mutation, { object: input })
  return response?.insert_organization_one?.id
}

export async function insertOrganizationMember(
  input: Organization_Member_Insert_Input
) {
  const mutation = gql`
    mutation InsertOrganizationMember(
      $input: organization_member_insert_input!
    ) {
      insert_organization_member_one(object: $input) {
        id
      }
    }
  `
  const response: { insert_organization_member_one: { id: string } } =
    await getClient().request(mutation, { input })
  return response?.insert_organization_member_one?.id
}

export async function deleteOrganization(id: string): Promise<boolean> {
  const mutation = gql`
    mutation DeleteOrganization($id: uuid!) {
      delete_organization_by_pk(id: $id) {
        id
        name
      }
    }
  `
  const response: { delete_organization_by_pk: { id: boolean; name: string } } =
    await getClient().request(mutation, { id })
  console.log(
    `Deleted "${response?.delete_organization_by_pk?.name}" successfully`
  )
  return response?.delete_organization_by_pk?.id
}

export async function deleteOrganizationsWhere(
  where: Organization_Bool_Exp
): Promise<boolean> {
  const mutation = gql`
    mutation DeleteOrganizations($where: organization_bool_exp!) {
      delete_organization(where: $where) {
        affected_rows
      }
    }
  `
  const response: { delete_organization: { affected_rows: boolean } } =
    await getClient().request(mutation, { where })
  return response?.delete_organization?.affected_rows
}

export async function deleteOrganizationMember(id: string): Promise<boolean> {
  const mutation = gql`
    mutation DeleteOrganizationMember($id: uuid!) {
      delete_organization_member_by_pk(id: $id) {
        id
      }
    }
  `
  const response: { delete_organization_member_by_pk: { id: boolean } } =
    await getClient().request(mutation, { id })
  return response?.delete_organization_member_by_pk?.id
}
