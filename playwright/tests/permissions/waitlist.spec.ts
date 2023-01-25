import { test } from '@playwright/test'

import { introspection } from '../../api/introspection-api'
;(
  [
    'anonymous',
    'unverified',
    'user',
    'trainer',
    'sales-admin',
    'tt-ops',
    'tt-admin',
  ] as const
).forEach(role => {
  test(`it allows ${role} user to insert a waitlist`, async () => {
    const schema = await introspection(role)

    const waitlistMutation = schema.__schema.mutationType.fields.find(
      m => m.name === 'insert_waitlist'
    )

    test.expect(waitlistMutation).toBeTruthy()
  })
})
