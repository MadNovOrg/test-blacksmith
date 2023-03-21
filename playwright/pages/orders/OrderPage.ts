import { expect, Locator, Page } from '@playwright/test'

import { OrderInfo } from '@app/generated/graphql'

import { BasePage } from '../BasePage'

export class OrderPage extends BasePage {
  readonly exportWholePageButton: Locator

  constructor(page: Page) {
    super(page)
    this.exportWholePageButton = this.page.locator(
      'button:has-text("Export whole page")'
    )
  }

  async goto() {
    await super.goto(`orders`)
  }

  async checkOrderVisiblity(orders: OrderInfo[]) {
    for (const order of orders) {
      await expect(
        this.page.locator(`tbody >> tr >> text="${order.xeroInvoiceNumber}"`)
      ).toBeVisible()
    }
  }

  async selectPaymentMethod(type: 'Credit card' | 'Invoice') {
    await this.page.click('text=Payment Method')
    await this.page.click(`text="${type}"`)
  }

  async waitForDownload() {
    await this.page.waitForEvent('download')
  }

  async exportWholePage() {
    await this.exportWholePageButton.click()
  }
}
