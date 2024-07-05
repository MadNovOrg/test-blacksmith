import { expect, test } from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'

import { QUERY as GetTempProfileQuery } from '@app/modules/profile/queries/get-temp-profile'
import { RoleName } from '@app/types'

import { HasuraRole, runQueryAsRole } from '../gql-query'

const allowedRoles: HasuraRole[] = [
  RoleName.UNVERIFIED,
  RoleName.USER,
  RoleName.TRAINER,
  RoleName.SALES_ADMIN,
  RoleName.TT_OPS,
  RoleName.TT_ADMIN,
]

const forbiddenRoles: HasuraRole[] = [RoleName.ANONYMOUS]

allowedRoles.forEach(role => {
  test(`@query GetTempProfile: role ${role} should be able to run the query`, async () => {
    await expect(
      runQueryAsRole(GetTempProfileQuery, {}, role, {
        'x-hasura-user-id': uuidv4(),
        'x-hasura-user-email': 'whatever',
      }),
    ).resolves.not.toThrow()
  })
})

forbiddenRoles.forEach(role => {
  test(`@query GetTempProfile: role ${role} should not be able to run the query`, async () => {
    await expect(
      runQueryAsRole(GetTempProfileQuery, {}, role, {
        'x-hasura-user-id': uuidv4(),
        'x-hasura-user-email': 'whatever',
      }),
    ).rejects.toEqual(expect.any(Error))
  })
})
