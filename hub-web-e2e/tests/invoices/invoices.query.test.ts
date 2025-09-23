import { expect, test } from '@playwright/test'

import { RoleName } from '@app/types'

import * as API from '@qa/api'

const insertRoles = [
  RoleName.ANONYMOUS,
  RoleName.LD,
  RoleName.SALES_ADMIN,
  RoleName.SALES_REPRESENTATIVE,
  RoleName.TRAINER,
  RoleName.TT_ADMIN,
  RoleName.TT_OPS,
  RoleName.UNVERIFIED,
  RoleName.USER,
] as RoleName[]

insertRoles.forEach(role => {
  test(`@query it doesn't allow role ${role} to insert an invoice`, async () => {
    const schema = await API.introspection.introspection(role)
    const insertMutation = schema.__schema.mutationType.fields.find(
      f => f.name === 'insert_xero_invoice',
    )
    const insertOneMutation = schema.__schema.mutationType.fields.find(
      f => f.name === 'insert_xero_invoice_one',
    )
    test.expect(insertMutation).toBeFalsy()
    test.expect(insertOneMutation).toBeFalsy()
  })
})

const selectRoles = [
  RoleName.SALES_ADMIN,
  RoleName.SALES_REPRESENTATIVE,
  RoleName.TRAINER,
  RoleName.TT_ADMIN,
  RoleName.TT_OPS,
  RoleName.USER,
] as RoleName[]

selectRoles.forEach(role => {
  test(`@query it allows role ${role} to select invoice`, async () => {
    const schema = await API.introspection.introspection(role)
    const allowedFields = [
      'amountDue',
      'amountPaid',
      'contact',
      'currencyCode',
      'dueDate',
      'fullyPaidOnDate',
      'id',
      'invoiceNumber',
      'issuedDate',
      'lineItems',
      'reference',
      'status',
      'subtotal',
      'total',
      'totalTax',
      'xeroContactId',
      'xeroId',
    ]
    const invoicesQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'xero_invoice',
    )
    const invoiceQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'xero_invoice_by_pk',
    )
    const invoiceType = schema.__schema.types.find(
      f => f.name === 'xero_invoice',
    )
    const invoiceFields = invoiceType?.fields.map(f => f.name)
    const hasAllowedFields = allowedFields?.every(f =>
      invoiceFields?.includes(f),
    )
    expect(invoiceQuery).toBeTruthy()
    expect(invoicesQuery).toBeTruthy()
    expect(hasAllowedFields).toBe(true)
  })
})

const cannotSelectRoles = [
  RoleName.ANONYMOUS,
  RoleName.UNVERIFIED,
] as RoleName[]

cannotSelectRoles.forEach(role => {
  test(`@query doesn't allow role ${role} to select an invoice`, async () => {
    const schema = await API.introspection.introspection(role)
    const invoicesQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'xero_invoice',
    )
    const invoiceQuery = schema.__schema.queryType.fields.find(
      f => f.name === 'xero_invoice_by_pk',
    )
    const invoiceType = schema.__schema.types.find(
      f => f.name === 'xero_invoice',
    )
    expect(invoicesQuery).toBeFalsy()
    expect(invoiceQuery).toBeFalsy()
    expect(invoiceType).toBeFalsy()
  })
})
