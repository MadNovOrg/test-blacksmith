import { expect, test } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'

import { InsertOrgLeadMutationVariables } from '@app/generated/graphql'
import { MUTATION as InsertOrgLeadMutation } from '@app/queries/organization/insert-org-lead'
import { RoleName } from '@app/types'

import { buildOrganization } from '@test/mock-data-utils'

import { HasuraRole, runQueryAsRole } from '../gql-query'

const allowedRoles: HasuraRole[] = [
  RoleName.UNVERIFIED,
  RoleName.SALES_ADMIN,
  RoleName.TT_OPS,
  RoleName.TT_ADMIN,
  RoleName.LD,
  RoleName.TRAINER,
  RoleName.USER,
  RoleName.ANONYMOUS,
]

function buildMutationInput(): InsertOrgLeadMutationVariables {
  const org = buildOrganization()
  return {
    address: {},
    name: org.name,
    sector: 'EDUCATION',
    orgType: org.organizationType,
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
