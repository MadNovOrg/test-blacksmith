import { expect, test } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'

import {
  InsertOrgMutationVariables,
  Trust_Type_Enum,
} from '@app/generated/graphql'
import { MUTATION as InsertOrgLeadMutation } from '@app/queries/organization/insert-org-lead'

import * as API from '@qa/api'

import { buildOrganization } from '@test/mock-data-utils'

import { HasuraRole, runQueryAsRole } from '../gql-query'

const allowedRoles: HasuraRole[] = [
  'unverified',
  'sales-admin',
  'tt-ops',
  'tt-admin',
  'ld',
]

const forbiddenRoles: HasuraRole[] = ['anonymous', 'user', 'trainer']

function buildMutationInput(): InsertOrgMutationVariables {
  const org = buildOrganization()
  return {
    address: {},
    name: org.name,
    trustName: 'insert-org-lead-spec',
    trustType: org.trustType as unknown as Trust_Type_Enum,
  }
}

allowedRoles.forEach(role => {
  test(`@query InsertOrgLead: role ${role} should be able to run the mutation`, async () => {
    await expect(
      runQueryAsRole(InsertOrgLeadMutation, buildMutationInput(), role, {
        'x-hasura-user-id': uuidv4(),
        'x-hasura-user-email': 'whatever',
      })
    ).resolves.not.toThrow()
  })
})

forbiddenRoles.forEach(role => {
  test(`@query InsertOrgLead: role ${role} should not be able to run the mutation`, async () => {
    await expect(
      runQueryAsRole(InsertOrgLeadMutation, buildMutationInput(), role, {
        'x-hasura-user-id': uuidv4(),
        'x-hasura-user-email': 'whatever',
      })
    ).rejects.toEqual(expect.any(Error))
  })
})

test.afterAll(async () => {
  await API.organization.deleteOrganizationsWhere({
    trustName: {
      _eq: 'insert-org-lead-spec',
    },
  })
})
