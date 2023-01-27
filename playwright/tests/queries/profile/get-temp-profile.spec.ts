import { expect, test } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'

import { QUERY as GetTempProfileQuery } from '@app/queries/profile/get-temp-profile'

import { HasuraRole, runQueryAsRole } from '../gql-query'

const allowedRoles: HasuraRole[] = [
  'unverified',
  'user',
  'trainer',
  'sales-admin',
  'tt-ops',
  'tt-admin',
]

const forbiddenRoles: HasuraRole[] = ['anonymous']

allowedRoles.forEach(role => {
  test(`@query GetTempProfile: role ${role} should be able to run the query`, async () => {
    await expect(
      runQueryAsRole(GetTempProfileQuery, {}, role, {
        'x-hasura-user-id': uuidv4(),
        'x-hasura-user-email': 'whatever',
      })
    ).resolves.not.toThrow()
  })
})

forbiddenRoles.forEach(role => {
  test(`@query GetTempProfile: role ${role} should not be able to run the query`, async () => {
    await expect(
      runQueryAsRole(GetTempProfileQuery, {}, role, {
        'x-hasura-user-id': uuidv4(),
        'x-hasura-user-email': 'whatever',
      })
    ).rejects.toEqual(expect.any(Error))
  })
})
