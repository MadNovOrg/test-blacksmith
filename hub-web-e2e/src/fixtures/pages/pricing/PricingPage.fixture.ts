import { Locator, Page } from '@playwright/test'

import { waitForGraphQLResponse } from '@qa/commands'

import { BasePage } from '../BasePage.fixture'

export class PricingPage extends BasePage {
  readonly editPricingFromMainPage: Locator
  readonly addPricing: Locator
  readonly effectiveFrom: Locator
  readonly effectiveTo: Locator
  readonly priceAmount: Locator
  readonly savePricingSchedule: Locator

  constructor(page: Page) {
    super(page)
    this.editPricingFromMainPage = this.page.locator('data-testid=EditIcon')
    this.addPricing = this.page.locator('data-testid=AddIcon')
    this.effectiveFrom = this.page.locator('div[data-field="effectiveFrom"]')
    this.effectiveTo = this.page.locator('div[data-field="effectiveTo"]')
    this.priceAmount = this.page.locator('div[data-field="priceAmount"]')
    this.savePricingSchedule = this.page.locator('data-testid=SaveIcon')
  }

  async createPricing(pricingToBeCreated: {
    effectiveFrom: string
    effectiveTo: string
    price: number
  }) {
    await this.addPricing.click()
    const effectiveFromInput = this.effectiveFrom.locator('input')
    const effectiveToInput = this.effectiveTo.locator('input')
    const priceAmountInput = this.priceAmount.locator('input')
    await effectiveFromInput.type(
      pricingToBeCreated.effectiveFrom.replaceAll('-', ''),
    )
    await effectiveToInput.type(
      pricingToBeCreated.effectiveTo.replaceAll('-', ''),
    )
    await priceAmountInput.fill(String(pricingToBeCreated.price))

    const responses = await Promise.all([
      waitForGraphQLResponse(this.page, 'course_pricing_schedule'),
      this.savePricingSchedule.click(),
    ])
    return responses[0].course_pricing_schedule.id ?? null
  }
}
