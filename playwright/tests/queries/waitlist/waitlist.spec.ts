import { expect, test } from '@playwright/test'

import { RoleName } from '@app/types'

import * as API from '@qa/api'

const insertWaitlistTests: ReadonlyArray<RoleName> = [
  RoleName.ANONYMOUS,
  RoleName.SALES_ADMIN,
  RoleName.TRAINER,
  RoleName.TT_ADMIN,
  RoleName.TT_OPS,
  RoleName.UNVERIFIED,
  RoleName.USER,
]

insertWaitlistTests.forEach(role => {
  test(`@query allows ${role} user to insert a waitlist`, async () => {
    const schema = await API.introspection.introspection(role)
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

const selectWaitlistTests: ReadonlyArray<RoleName> = [
  RoleName.SALES_ADMIN,
  RoleName.TRAINER,
  RoleName.TT_ADMIN,
  RoleName.TT_OPS,
]

selectWaitlistTests.forEach(role => {
  test(`@query allows role ${role} to select waitlist`, async () => {
    const schema = await API.introspection.introspection(role)
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

const selectWaitlistNotAllowedTests: ReadonlyArray<RoleName> = [
  RoleName.ANONYMOUS,
  RoleName.UNVERIFIED,
]

selectWaitlistNotAllowedTests.forEach(role => {
  test(`@query doesn't allow role ${role} to select waitlist`, async () => {
    const schema = await API.introspection.introspection(role)
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
