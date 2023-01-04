/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'
import { readFile } from 'xlsx'

import { Go1_History_Events_Enum } from '@app/generated/graphql'

import { deleteOrganization, insertOrganization } from '../../api/hasura-api'
import { insertGo1HistoryEvent } from '../../api/hasura/go1-licensing'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const test = base.extend<{ orgId: string }>({
  orgId: async ({}, use) => {
    const id = await insertOrganization({ name: 'Test organization' })

    await insertGo1HistoryEvent({
      event: Go1_History_Events_Enum.LicensesAdded,
      balance: 10,
      change: 10,
      org_id: id,
      payload: {
        invoiceId: 'INV.001',
        invokedBy: 'John Doe',
      },
    })

    await use(id)
    await deleteOrganization(id)
  },
})

test.use({ storageState: stateFilePath('admin') })

test('export licenses as CSV', async ({ page, orgId }) => {
  await page.goto(`${BASE_URL}/organisations/${orgId}`)
  await page.waitForLoadState('networkidle')

  await page.click('button:has-text("Blended learning licences")')

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Export")'),
  ])

  const downloadPath = (await download.path()) as string

  const workbook = readFile(downloadPath)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]

  test.expect(sheet['A1'].v).toBe('Date')
  test.expect(sheet['B1'].v).toBe('Event')
  test.expect(sheet['C1'].v).toBe('Invoice number')
  test.expect(sheet['D1'].v).toBe('Course code')
  test.expect(sheet['E1'].v).toBe('Note')
  test.expect(sheet['F1'].v).toBe('Invoked by')
  test.expect(sheet['G1'].v).toBe('Action')
  test.expect(sheet['H1'].v).toBe('Balance')
  test.expect(sheet['I1'].v).toBe('Reserved balance')

  test.expect(sheet['B2'].v).toBe(Go1_History_Events_Enum.LicensesAdded)
  test.expect(sheet['C2'].v).toBe('INV.001')
  test.expect(sheet['F2'].v).toBe('John Doe')

  test.expect(sheet['G2'].v).toEqual('+10')
  test.expect(sheet['H2'].v).toEqual(10)
  test.expect(sheet['I2'].v).toEqual(0)
})
