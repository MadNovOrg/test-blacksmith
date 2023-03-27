import { test as base } from '@playwright/test'

import {
  OrderInfoFragment,
  Order_By,
  Payment_Methods_Enum,
} from '@app/generated/graphql'

import { getOrders } from '../../api/hasura/orders'
import { stateFilePath } from '../../hooks/global-setup'
import { OrderPage } from '../../pages/orders/OrderPage'

const test = base.extend<{
  unfilteredOrders: OrderInfoFragment[]
  invoiceOrders: OrderInfoFragment[]
  ccOrders: OrderInfoFragment[]
}>({
  unfilteredOrders: async ({}, use) => {
    const orders = await getOrders({
      limit: 12,
      offset: 0,
      orderBy: [{ createdAt: Order_By.Asc }],
      where: {},
    })
    await use(orders)
  },
  invoiceOrders: async ({}, use) => {
    const orders = await getOrders({
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
  await orderPage.checkOrderVisiblity(unfilteredOrders)
})

test('list orders filtered by credit card type', async ({ page, ccOrders }) => {
  const orderPage = new OrderPage(page)
  await orderPage.goto()
  await orderPage.selectPaymentMethod('Credit card')
  await orderPage.checkOrderVisiblity(ccOrders)
})

test('list orders filtered by invoice type', async ({
  page,
  invoiceOrders,
}) => {
  const orderPage = new OrderPage(page)
  await orderPage.goto()
  await orderPage.selectPaymentMethod('Invoice')
  await orderPage.checkOrderVisiblity(invoiceOrders)
})
