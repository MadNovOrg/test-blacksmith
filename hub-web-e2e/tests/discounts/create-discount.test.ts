import { test, expect } from '@playwright/test'

import * as API from '@qa/api'
import { DiscountsPage } from '@qa/fixtures/pages/administration/DiscountsPage.fixture'
import { NewDiscountPage } from '@qa/fixtures/pages/administration/NewDiscountPage.fixture'
import { stateFilePath } from '@qa/util'

test.use({ storageState: stateFilePath('admin') })

test('Should redirect to the new discount page when clicking on the create discount button', async ({
  page,
}) => {
  const discountsPage = new DiscountsPage(page)
  await discountsPage.goto()

  await discountsPage.createDiscountButton.click()
  const url = new URL(page.url())
  expect(url.pathname).toBe('/admin/discounts/new')
})

test('Should be able to cancel the creation of a code and go back to the discounts page', async ({
  page,
}) => {
  const newDiscountPage = new NewDiscountPage(page)
  await newDiscountPage.goto()

  await newDiscountPage.cancelButton.click()

  const url = new URL(page.url())
  expect(url.pathname).toBe('/admin/discounts')
})

test('Should not allow creating a discount without a code', async ({
  page,
}) => {
  const newDiscountPage = new NewDiscountPage(page)
  await newDiscountPage.goto()

  await newDiscountPage.createDiscountButton.click()

  const errorText = newDiscountPage.page.getByText('Discount code is required')
  expect(await errorText.count()).toBe(1)
})

test('Should not allow creating a discount code that already exists', async ({
  page,
}) => {
  const existingCode = 'EXISTING_CODE'
  await API.promoCode.createSample(existingCode)

  const newDiscountPage = new NewDiscountPage(page)
  await newDiscountPage.goto()

  await newDiscountPage.discountCodeInput.fill(existingCode)

  const errorText = newDiscountPage.page.getByText(
    'This code has already been used',
  )
  await errorText.waitFor({ state: 'visible' })

  expect(await errorText.count()).toBe(1)
})

// eslint-disable-next-line playwright/expect-expect
test('Should redirect to the discounts page after creating a discount successfully', async ({
  page,
}) => {
  const newCode = 'NEW_CODE'
  await API.promoCode.removeByCode(newCode)

  const newDiscountPage = new NewDiscountPage(page)
  await newDiscountPage.goto()

  await newDiscountPage.discountCodeInput.fill('NEW_CODE')
  await newDiscountPage.createDiscountButton.click()
  // wait for request to complete
  await page.waitForURL('admin/discounts')
})
