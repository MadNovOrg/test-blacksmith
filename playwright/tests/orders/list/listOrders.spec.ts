/* eslint-disable no-empty-pattern */
import { test } from '@playwright/test'

import { stateFilePath } from '../../../hooks/global-setup'
import { ListOrdersPage } from '../../../pages/orders/ListOrdersPage'

test('list orders', async ({ browser }) => {
  test.setTimeout(30000)
  const userContext = await browser.newContext({
    storageState: stateFilePath('user1'),
  })
  const adminContext = await browser.newContext({
    storageState: stateFilePath('admin'),
  })
  const orgAdminContext = await browser.newContext({
    storageState: stateFilePath('orgAdmin'),
  })

  const userPage = await userContext.newPage()
  const adminPage = await adminContext.newPage()
  const orgAdminPage = await orgAdminContext.newPage()

  // User shouldn't be able to see orders list
  const user = new ListOrdersPage(userPage, false)
  await user.goto()
  user.checkIfPageLoaded()

  // Org Admins shoyuldn't be able to see orders list
  const orgAdmin = new ListOrdersPage(orgAdminPage, false)
  await orgAdmin.goto()
  orgAdmin.checkIfPageLoaded()

  // Admins should be able to see orders list
  const admin = new ListOrdersPage(adminPage, true)
  await admin.goto()
  admin.checkIfPageLoaded()

  // Orders are visible with no filters set
  await admin.checkFilters()

  // Mix filters and validate
  await admin.toggleCCFilter()
  await admin.checkFilters()

  await admin.toggleInvoiceFilter()
  await admin.checkFilters()

  await admin.toggleCCFilter()
  await admin.toggleInvoiceFilter()
  await admin.checkFilters()

  // Validate data export
  await admin.checkExport()
})
