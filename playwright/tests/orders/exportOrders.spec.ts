/* eslint-disable no-empty-pattern */
import { Download, test as base } from '@playwright/test'
import { readFile } from 'xlsx'

import { Order_By, Payment_Methods_Enum } from '@app/generated/graphql'

import { getOrders } from '../../api/hasura/orders'
import { waitForPageLoad } from '../../commands'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

type Orders = Awaited<ReturnType<typeof getOrders>>

const test = base.extend<{
  orders: Orders
}>({
  orders: async ({}, use) => {
    const orders = await getOrders({
      orderBy: { createdAt: Order_By.Asc },
      offset: 0,
      limit: 12,
    })

    await use(orders)
  },
})

test.use({ storageState: stateFilePath('admin') })

const PAYMENT_METHODS: Record<Payment_Methods_Enum, string> = {
  [Payment_Methods_Enum.Cc]: 'Credit Card',
  [Payment_Methods_Enum.Invoice]: 'Invoice',
}

async function assertDownloadedCSV(download: Download, data: Orders) {
  const downloadPath = (await download.path()) as string

  const workbook = readFile(downloadPath)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]

  test.expect(sheet['A1'].v).toMatch('Invoice no.')
  test.expect(sheet['B1'].v).toMatch('Organisation')
  test.expect(sheet['C1'].v).toMatch('Payment Method')
  test.expect(sheet['D1'].v).toMatch('Amount')
  test.expect(sheet['E1'].v).toMatch('Due')
  test.expect(sheet['F1'].v).toMatch('Due Date')
  test.expect(sheet['G1'].v).toMatch('Status')

  data.forEach((order, index) => {
    const cellIndex = index + 2

    test.expect(sheet[`A${cellIndex}`].v).toBe(order.xeroInvoiceNumber)
    test.expect(sheet[`B${cellIndex}`].v).toBe(order.organization.name)
    test
      .expect(sheet[`C${cellIndex}`].v)
      .toMatch(PAYMENT_METHODS[order.paymentMethod])
    test.expect(sheet[`D${cellIndex}`].v).toBe(Number(order.orderTotal))

    if (order.orderDue) {
      test.expect(sheet[`E${cellIndex}`].v).toBe(order.orderDue ?? '')
    }
  })
}

test('exports all orders from the page', async ({ page, orders }) => {
  await page.goto(`${BASE_URL}/orders`)
  await waitForPageLoad(page)

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Export whole page")'),
  ])

  await assertDownloadedCSV(download, orders)
})

test('exports selected orders', async ({ page, orders }) => {
  await page.goto(`${BASE_URL}/orders`)
  await waitForPageLoad(page)

  test.expect(page.locator('button:has-text("Export selected")')).toBeDisabled()

  await page.click(`data-testid=${orders[0].id} >> data-testid=TableChecks-Row`)

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Export selected")'),
  ])

  await assertDownloadedCSV(download, [orders[0]])
})
