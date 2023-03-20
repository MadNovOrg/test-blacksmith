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
    'sales-representative',
  ] as const
).forEach(role => {
  test(`@query it doesn't allow role ${role}  to insert a contact`, async () => {
    const schema = await introspection(role)

    const insertMutation = schema.__schema.mutationType.fields.find(
      f => f.name === 'insert_xero_contact'
    )
    const insertOneMutation = schema.__schema.mutationType.fields.find(
      f => f.name === 'insert_xero_contact_one'
    )

    test.expect(insertMutation).toBeFalsy()
    test.expect(insertOneMutation).toBeFalsy()
  })
})
;(['sales-admin', 'tt-ops', 'tt-admin', 'ld'] as const).forEach(role => {
  test(`@query it allows role ${role} to select contact`, async () => {
    const schema = await introspection(role)
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
      f => f.name === 'xero_contact'
    )
    const contactQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'xero_contact_by_pk'
    )
    const contactType = schema.__schema.types.find(
      f => f.name === 'xero_contact'
    )
    const contactFields = contactType?.fields.map(f => f.name)

    const hasAllowedFields = allowedFields?.every(f =>
      contactFields?.includes(f)
    )

    expect(contactQuery).toBeTruthy()
    expect(contactsQuery).toBeTruthy()
    expect(hasAllowedFields).toBe(true)
  })
})
;(
  [
    'unverified',
    'anonymous',
    'user',
    'trainer',
    'sales-representative',
  ] as const
).forEach(role => {
  test(`@query doesn't allow role ${role} to select a contact`, async () => {
    const schema = await introspection(role)
    const contactsQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'xero_contact'
    )
    const contactQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'xero_contact_by_pk'
    )
    const contactType = schema.__schema.types.find(
      f => f.name === 'xero_contact'
    )
    expect(contactsQuery).toBeFalsy()
    expect(contactQuery).toBeFalsy()
    expect(contactType).toBeFalsy()
  })
})
