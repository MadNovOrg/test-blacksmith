import { test as base } from '@playwright/test'

import { Order_By, Payment_Methods_Enum } from '@app/generated/graphql'

import { getOrders } from '../../api/hasura/orders'
import { stateFilePath } from '../../hooks/global-setup'
import { OrderPage } from '../../pages/orders/OrderPage'

const test = base.extend<{
  unfilteredOrders: Awaited<ReturnType<typeof getOrders>>
  invoiceOrders: Awaited<ReturnType<typeof getOrders>>
  ccOrders: Awaited<ReturnType<typeof getOrders>>
}>({
  unfilteredOrders: async ({}, use) => {
    const orders = await getOrders({
      invoiceStatus: [],
      limit: 12,
      offset: 0,
      orderBy: [{ createdAt: Order_By.Asc }],
      where: {},
    })
    await use(orders)
  },
  invoiceOrders: async ({}, use) => {
    const orders = await getOrders({
      invoiceStatus: [],
      limit: 12,
      offset: 0,
      orderBy: [{ createdAt: Order_By.Asc }],
      where: { paymentMethod: { _eq: Payment_Methods_Enum.Invoice } },
    })
    await use(orders)
  },
  ccOrders: async ({}, use) => {
    const orders = await getOrders({
      orderBy: [{ createdAt: Order_By.Asc }],
      where: { paymentMethod: { _eq: Payment_Methods_Enum.Cc } },
      offset: 0,
      limit: 12,
      invoiceStatus: [],
    })
    await use(orders)
  },
})

test.use({ storageState: stateFilePath('admin') })

// not creating fixtures as there is an event for every new order
// that a triggers Xero invoice, and we don't want to spam from E2E env
// when an event gets removed, refactor test to insert orders and assert on them
test('list all orders', async ({ page, unfilteredOrders }) => {
  const orderPage = new OrderPage(page)
  await orderPage.goto()

  unfilteredOrders.forEach(async order =>
    orderPage.checkInvoiceVisible(`${order.xeroInvoiceNumber}`)
  )
})

test('list orders filtered by credit card type', async ({ page, ccOrders }) => {
  const orderPage = new OrderPage(page)
  await orderPage.goto()

  // filter by credit card payment methods
  await orderPage.selectPaymentMethod('Credit card')

  ccOrders.forEach(async order =>
    orderPage.checkInvoiceVisible(`${order.xeroInvoiceNumber}`)
  )
})

test('list orders filtered by invoice type', async ({
  page,
  invoiceOrders,
}) => {
  const orderPage = new OrderPage(page)
  await orderPage.goto()

  // filter by invoice payment method
  await orderPage.selectPaymentMethod('Invoice')

  invoiceOrders.forEach(async order =>
    orderPage.checkInvoiceVisible(`${order.xeroInvoiceNumber}`)
  )
})
