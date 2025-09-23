import { gql } from 'graphql-request'

import {
  Go1_Licenses_History_Insert_Input,
  Organization_Bool_Exp,
  Organization_Insert_Input,
  Organization_Invites_Insert_Input,
  Organization_Member_Insert_Input,
} from '@app/generated/graphql'

import { getClient } from './client'

export const getOrganizationId = async (name: string): Promise<string> => {
  const query = gql`query OrganizationById { organization(where: {name: {_ilike: "%${name}%"}}) { id }}`
  const response: { organization: { id: string }[] } =
    await getClient().request(query)
  return response.organization[0].id
}

export async function insertOrganization(
  input: Organization_Insert_Input,
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
  input: Organization_Member_Insert_Input,
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

export async function insertOrganizationInvite(
  input: Organization_Invites_Insert_Input,
) {
  const mutation = gql`
    mutation InsertOrganizationInvite(
      $input: organization_invites_insert_input!
    ) {
      insert_organization_invites_one(object: $input) {
        id
      }
    }
  `
  const response: { insert_organization_invites_one: { id: string } } =
    await getClient().request(mutation, { input })
  return response?.insert_organization_invites_one.id
}

export const deleteOrganization = async (id: string) => {
  if (!id) {
    console.log(`Cannot delete the organisation without id`)
    return
  }
  const mutation = gql`
    mutation DeleteOrganization($id: uuid!) {
      delete_organization_by_pk(id: $id) {
        id
        name
      }
    }
  `
  const response: { delete_organization_by_pk: { id: string; name: string } } =
    await getClient().request(mutation, { id })
  console.log(
    `Deleted ${response?.delete_organization_by_pk?.name} successfully`,
  )
}

export async function deleteOrganizationsWhere(
  where: Organization_Bool_Exp,
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

export async function deleteOrganizationInvite(id: string): Promise<boolean> {
  if (!id) {
    console.log(`Cannot delete the organization invite without id`)
    return false
  }
  const mutation = gql`
    mutation DeleteOrganizationInvite($id: uuid!) {
      delete_organization_invites_by_pk(id: $id) {
        id
      }
    }
  `
  const response: { delete_organization_invites_by_pk: { id: boolean } } =
    await getClient().request(mutation, { id })
  console.log(`Deleted organization invite with id: ${id}`)
  return response?.delete_organization_invites_by_pk?.id
}

export async function getOrgInviteId(
  orgId: string,
  email: string,
): Promise<string> {
  const query = gql`
    query GetOrgInviteId($orgId: uuid!, $email: String!) {
      organization_invites(
        where: { _and: { orgId: { _eq: $orgId }, email: { _eq: $email } } }
      ) {
        id
      }
    }
  `
  const response: { organization_invites: { id: string }[] } =
    await getClient().request(query, { orgId, email })
  return response?.organization_invites[0]?.id
}

export async function insertBLLicenseHistory(
  input: Go1_Licenses_History_Insert_Input,
) {
  const mutation = gql`
    mutation insertBLLicenseHistory(
      $input: go1_licenses_history_insert_input!
    ) {
      insert_go1_licenses_history(objects: [$input]) {
        returning {
          id
        }
      }
    }
  `

  const response: {
    insert_go1_licenses_history: {
      returning: { id: string; payload: string }[]
    }
  } = await getClient().request(mutation, { input })

  return response.insert_go1_licenses_history.returning[0]
}

export async function deleteBLLicenseHistory(id: string) {
  const mutation = gql`
    mutation deleteBLLicenseHistory($id: uuid!) {
      delete_go1_licenses_history_by_pk(id: $id) {
        id
      }
    }
  `
  const response: {
    delete_go1_licenses_history_by_pk: { id: string }
  } = await getClient().request(mutation, { id })

  console.log(
    `Deleted GO1 license history with id ${response.delete_go1_licenses_history_by_pk.id}`,
  )
}
