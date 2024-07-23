import { test, expect } from '@playwright/test'

import * as API from '@qa/api'
import { PricingPage } from '@qa/fixtures/pages/pricing/PricingPage.fixture'
import { stateFilePath, StoredCredentialKey } from '@qa/util'

let pricingIdToDelete: null | string = null

test.afterEach(async () => {
  await API.pricing.deletePricingSchedule(String(pricingIdToDelete))
})

const allowedRoles = ['admin'] as StoredCredentialKey[]
allowedRoles.forEach(role => {
  test(`Creates course pricing schedule as ${role}`, async ({ browser }) => {
    const context = await browser.newContext({
      storageState: stateFilePath(role),
    })
    const page = await context.newPage()
    const pricingToBeCreated = {
      effectiveFrom: '30-12-2100',
      effectiveTo: '31-12-2100',
      price: 130,
    }
    const pricingPage = new PricingPage(page)
    await pricingPage.goto('admin/pricing')
    await pricingPage.editPricingFromMainPage.first().click()
    const newPricingId = await pricingPage.createPricing(pricingToBeCreated)
    pricingIdToDelete = newPricingId
    expect(newPricingId).not.toBe(null)
  })
})
