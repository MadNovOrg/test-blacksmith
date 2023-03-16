import { Download, expect, test as base } from '@playwright/test'
import { readFile } from 'xlsx'

import {
  OrderInfo,
  Order_By,
  Payment_Methods_Enum,
} from '@app/generated/graphql'

import { getOrders } from '../../api/hasura/orders'
import { stateFilePath } from '../../hooks/global-setup'
import { OrderPage } from '../../pages/orders/OrderPage'

type Orders = Awaited<ReturnType<typeof getOrders>>

const test = base.extend<{
  orders: Orders
}>({
  orders: async ({}, use) => {
    const orders = await getOrders({
      invoiceStatus: [],
      limit: 12,
      offset: 0,
      orderBy: [{ createdAt: Order_By.Asc }],
      where: {},
    })
    await use(orders)
  },
})

test.use({ storageState: stateFilePath('admin') })

const PAYMENT_METHODS: Record<Payment_Methods_Enum, string> = {
  [Payment_Methods_Enum.Cc]: 'Credit Card',
  [Payment_Methods_Enum.Invoice]: 'Invoice',
}

async function assertDownloadedCSV(download: Download, data: OrderInfo[]) {
  const downloadPath = (await download.path()) as string

  const workbook = readFile(downloadPath)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]

  expect(sheet['A1'].v).toMatch(/Invoice no\./)
  expect(sheet['B1'].v).toMatch(/Reference no\./)
  expect(sheet['C1'].v).toMatch(/Bill to/)
  expect(sheet['D1'].v).toMatch(/Payment Method/)
  expect(sheet['E1'].v).toMatch(/Amount/)
  expect(sheet['F1'].v).toMatch(/Due/)
  expect(sheet['G1'].v).toMatch(/Due Date/)
  expect(sheet['H1'].v).toMatch(/Status/)

  expect(data).not.toBe(null)
  expect(data).not.toBe(undefined)

  data?.forEach((order, index) => {
    const cellIndex = index + 2

    expect(sheet[`A${cellIndex}`].v).toBe(order?.xeroInvoiceNumber)
    expect(sheet[`C${cellIndex}`].v).toContain(order?.organization?.name)
    expect(sheet[`C${cellIndex}`].v).toContain(
      order?.organization?.address?.line1
    )
    expect(sheet[`C${cellIndex}`].v).toContain(
      order?.organization?.address?.city
    )
    expect(sheet[`C${cellIndex}`].v).toContain(
      order?.organization?.address?.postCode
    )

    const paymentMethod = order?.paymentMethod
      ? PAYMENT_METHODS[order.paymentMethod]
      : 'error'

    expect(sheet[`D${cellIndex}`].v).toMatch(new RegExp(paymentMethod))
    expect(sheet[`E${cellIndex}`].v).toBe(Number(order?.orderTotal))

    if (order?.orderDue) {
      expect(sheet[`F${cellIndex}`].v).toBe(order?.orderDue ?? '')
    }
  })
}

test('exports all orders from the page', async ({ page, orders }) => {
  const orderPage = new OrderPage(page)
  await orderPage.goto()

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Export whole page")'),
  ])

  await assertDownloadedCSV(download, orders)
})

test('exports selected orders', async ({ page, orders }) => {
  const orderPage = new OrderPage(page)
  await orderPage.goto()

  await expect(
    page.locator('button:has-text("Export selected")')
  ).toBeDisabled()

  await page.click(`data-testid=${orders[0].id} >> data-testid=TableChecks-Row`)
  await page.click(`data-testid=${orders[1].id} >> data-testid=TableChecks-Row`)

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Export selected")'),
  ])

  await assertDownloadedCSV(download, orders.slice(0, 1))
})
