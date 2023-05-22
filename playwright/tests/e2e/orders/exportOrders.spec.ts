import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { TEST_SETTINGS } from '@qa/constants'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { UNIQUE_ORDER } from '@qa/data/order'
import { users } from '@qa/data/users'
import { stateFilePath } from '@qa/hooks/global-setup'
import { OrderPage } from '@qa/pages/orders/OrderPage'

type Orders = Awaited<ReturnType<typeof API.order.getOrders>>

const test = base.extend<{
  orders: Orders
}>({
  orders: async ({}, use) => {
    let orders = await API.order.getOrders()
    const course = 0
    // Ensure there is always at least one order
    if (orders.length < 1) {
      const newCourse = UNIQUE_COURSE()
      const courseId = await API.course.insertCourse(
        newCourse,
        users.trainer.email
      )
      newCourse.id = courseId
      const newOrder = await UNIQUE_ORDER(newCourse, users.userOrgAdmin, [
        users.user1,
      ])
      await API.order.insertOrder(newOrder)
      orders = await API.order.getOrders()
    }
    await use(orders)
    if (course) {
      await API.course.deleteCourse(course)
    }
  },
})

test.beforeEach(async ({}) => {
  TEST_SETTINGS.role = 'tt-admin'
})

test.afterEach(async ({}) => {
  TEST_SETTINGS.role = ''
})

test.use({ storageState: stateFilePath('admin') })

test('exports all orders from the page', async ({ page, orders }) => {
  const orderPage = new OrderPage(page)
  await orderPage.goto()
  const [download] = await orderPage.download('all')
  await orderPage.assertDownloadedCSV(download, orders)
})

test('exports selected orders', async ({ page, orders }) => {
  const orderPage = new OrderPage(page)
  await orderPage.goto()
  await orderPage.expectSelectedDisabled()
  // Ensure regardless of how many orders there are
  // We select at least one, if there are more, then we select half
  await orderPage.selectRandomRows(orders)
  const [download] = await orderPage.download('selected')
  await orderPage.assertDownloadedCSV(download, orders.slice(0, 1))
})
