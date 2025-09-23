import { expect, test } from '@playwright/test'

import { RoleName } from '@app/types'

import * as API from '@qa/api'

const insertRoles = [
  RoleName.ANONYMOUS,
  RoleName.SALES_ADMIN,
  RoleName.SALES_REPRESENTATIVE,
  RoleName.TRAINER,
  RoleName.TT_ADMIN,
  RoleName.TT_OPS,
  RoleName.UNVERIFIED,
  RoleName.USER,
] as RoleName[]

insertRoles.forEach(role => {
  test(`@query it doesn't allow role ${role} to insert a contact`, async () => {
    const schema = await API.introspection.introspection(role)
    const insertMutation = schema.__schema.mutationType.fields.find(
      f => f.name === 'insert_xero_contact',
    )
    const insertOneMutation = schema.__schema.mutationType.fields.find(
      f => f.name === 'insert_xero_contact_one',
    )
    test.expect(insertMutation).toBeFalsy()
    test.expect(insertOneMutation).toBeFalsy()
  })
})

const selectRoles = [
  RoleName.SALES_ADMIN,
  RoleName.TT_OPS,
  RoleName.TT_ADMIN,
  RoleName.LD,
  RoleName.USER,
  RoleName.TRAINER,
  RoleName.SALES_REPRESENTATIVE,
] as RoleName[]

selectRoles.forEach(role => {
  test(`@query it allows role ${role} to select contact`, async () => {
    const schema = await API.introspection.introspection(role)
    const allowedFields = [
      'addresses',
      'emailAddress',
      'firstName',
      'lastName',
      'id',
      'name',
      'phones',
      'xeroId',
    ]
    const contactsQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'xero_contact',
    )
    const contactQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'xero_contact_by_pk',
    )
    const contactType = schema.__schema.types.find(
      f => f.name === 'xero_contact',
    )
    const contactFields = contactType?.fields.map(f => f.name)
    const hasAllowedFields = allowedFields?.every(f =>
      contactFields?.includes(f),
    )
    expect(contactQuery).toBeTruthy()
    expect(contactsQuery).toBeTruthy()
    expect(hasAllowedFields).toBe(true)
  })
})

const cannotSelectRoles = [
  RoleName.ANONYMOUS,
  RoleName.UNVERIFIED,
] as RoleName[]

cannotSelectRoles.forEach(role => {
  test(`@query doesn't allow role ${role} to select a contact`, async () => {
    const schema = await API.introspection.introspection(role)
    const contactsQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'xero_contact',
    )
    const contactQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'xero_contact_by_pk',
    )
    const contactType = schema.__schema.types.find(
      f => f.name === 'xero_contact',
    )
    expect(contactsQuery).toBeFalsy()
    expect(contactQuery).toBeFalsy()
    expect(contactType).toBeFalsy()
  })
})
