import { expect, test } from '@playwright/test'

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
    const allowedFields = [
      'courseId',
      'email',
      'familyName',
      'givenName',
      'orgName',
      'phone',
    ]
    const forbiddenFields = ['confirmed', 'created_at', 'id']
    const waitlistMutation = schema.__schema.mutationType.fields.find(
      m => m.name === 'insert_waitlist'
    )
    const insertWaitlistInput = schema.__schema.types.find(
      o => o.name === 'waitlist_insert_input'
    )
    const mutationFields = insertWaitlistInput?.inputFields.map(i => i.name)
    const hasAllowedFields = allowedFields.every(f =>
      mutationFields?.includes(f)
    )
    const hasForbiddenFields = forbiddenFields.some(f =>
      mutationFields?.includes(f)
    )
    expect(waitlistMutation).toBeTruthy()
    expect(hasAllowedFields).toEqual(true)
    expect(hasForbiddenFields).toBe(false)
  })
})
;(['sales-admin', 'trainer', 'tt-ops', 'tt-admin'] as const).forEach(role => {
  test(`it allows role ${role} to select waitlist`, async () => {
    const schema = await introspection(role)
    const allowedFields = [
      'confirmed',
      'courseId',
      'email',
      'familyName',
      'givenName',
      'orgName',
      'phone',
    ]
    const waitlistsQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'waitlist'
    )
    const waitlistQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'waitlist_by_pk'
    )
    const waitlistType = schema.__schema.types.find(f => f.name === 'waitlist')
    const waitlistFields = waitlistType?.fields.map(f => f.name)
    const hasAllowedFields = allowedFields.every(f =>
      waitlistFields?.includes(f)
    )

    expect(waitlistQuery).toBeTruthy()
    expect(waitlistsQuery).toBeTruthy()
    expect(hasAllowedFields).toBe(true)
  })
})
;(['unverified', 'anonymous'] as const).forEach(role => {
  test(`doesn't allow role ${role} to select waitlist`, async () => {
    const schema = await introspection(role)
    const waitlistsQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'waitlist'
    )
    const waitlistQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'waitlist_by_pk'
    )
    expect(waitlistQuery).toBeFalsy()
    expect(waitlistsQuery).toBeFalsy()
  })
})
