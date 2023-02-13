import { expect, test } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'

import OrgLicensesWithHistoryQuery from '@app/queries/go1-licensing/org-licenses-with-history'

import { HasuraRole, runQueryAsRole } from '../gql-query'

const allowedRoles: HasuraRole[] = ['sales-admin', 'tt-ops', 'tt-admin', 'ld']

const forbiddenRoles: HasuraRole[] = [
  'unverified',
  'anonymous',
  'user',
  'trainer',
]

const params = {
  id: uuidv4(),
  limit: 10,
  offset: 0,
}
allowedRoles.forEach(role => {
  test(`@query OrgLicensesWithHistoryQuery: role ${role} should be able to run the query`, async () => {
    await expect(
      runQueryAsRole(OrgLicensesWithHistoryQuery, params, role, {
        'x-hasura-user-id': uuidv4(),
        'x-hasura-user-email': 'whatever',
      })
    ).resolves.not.toThrow()
  })
})

forbiddenRoles.forEach(role => {
  test(`@query OrgLicensesWithHistoryQuery: role ${role} should not be able to run the query`, async () => {
    await expect(
      runQueryAsRole(OrgLicensesWithHistoryQuery, params, role, {
        'x-hasura-user-id': uuidv4(),
        'x-hasura-user-email': 'whatever',
      })
    ).rejects.toEqual(expect.any(Error))
  })
})
