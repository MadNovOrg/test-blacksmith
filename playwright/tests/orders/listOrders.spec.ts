/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { Order_By, Payment_Methods_Enum } from '@app/generated/graphql'

import { getOrders } from '../../api/hasura/orders'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const test = base.extend<{
  unfilteredOrders: Awaited<ReturnType<typeof getOrders>>
  invoiceOrders: Awaited<ReturnType<typeof getOrders>>
  ccOrders: Awaited<ReturnType<typeof getOrders>>
}>({
  unfilteredOrders: async ({}, use) => {
    const orders = await getOrders({
      orderBy: { createdAt: Order_By.Asc },
      offset: 0,
      limit: 12,
    })

    await use(orders)
  },
  invoiceOrders: async ({}, use) => {
    const orders = await getOrders({
      orderBy: { createdAt: Order_By.Asc },
      where: { paymentMethod: { _eq: Payment_Methods_Enum.Invoice } },
      offset: 0,
      limit: 12,
    })

    await use(orders)
  },
  ccOrders: async ({}, use) => {
    const orders = await getOrders({
      orderBy: { createdAt: Order_By.Asc },
      where: { paymentMethod: { _eq: Payment_Methods_Enum.Cc } },
      offset: 0,
      limit: 12,
    })

    await use(orders)
  },
})

test.use({ storageState: stateFilePath('admin') })

// not creating fixtures as there is an event for every new order
// that a triggers Xero invoice, and we don't want to spam from E2E env
// when an event gets removed, refactor test to insert orders and assert on them
test('list orders', async ({
  browser,
  unfilteredOrders,
  invoiceOrders,
  ccOrders,
}) => {
  test.setTimeout(30000)

  const adminContext = await browser.newContext({
    storageState: stateFilePath('admin'),
  })

  const adminPage = await adminContext.newPage()

  await adminPage.goto(`${BASE_URL}/orders`)
  await adminPage.waitForLoadState('networkidle')

  unfilteredOrders.forEach(order => {
    test
      .expect(
        adminPage.locator(`tbody >> tr >> text="${order.xeroInvoiceNumber}"`)
      )
      .toBeVisible()
  })

  // filter by credit card payment method
  await adminPage.click('text="Payment Method"')
  await adminPage.click('text="Credit card"')
  await adminPage.waitForLoadState('networkidle')

  ccOrders.forEach(order => {
    test
      .expect(
        adminPage.locator(`tbody >> tr >> text="${order.xeroInvoiceNumber}"`)
      )
      .toBeVisible()
  })

  // filter by both payment methods
  await adminPage.click('text="Credit card"')
  await adminPage.click('text="Invoice"')
  await adminPage.waitForLoadState('networkidle')

  invoiceOrders.forEach(order => {
    test
      .expect(
        adminPage.locator(`tbody >> tr >> text="${order.xeroInvoiceNumber}"`)
      )
      .toBeVisible()
  })
})
