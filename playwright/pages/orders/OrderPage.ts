import { expect, Locator, Page } from '@playwright/test'

import { OrderInfo } from '@app/generated/graphql'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

export class OrderPage extends BasePage {
  readonly exportWholePageButton: Locator
  readonly paymentMethod: Locator

  constructor(page: Page) {
    super(page)
    this.exportWholePageButton = this.page.locator(
      'button:has-text("Export whole page")'
    )
    this.paymentMethod = this.page.locator(`data-testid="payment-method"`)
  }

  async goto() {
    await super.goto(`${BASE_URL}/orders`)
  }

  async checkInvoiceVisible(orders: OrderInfo[]) {
    orders.forEach(
      async order =>
        await expect(
          this.page.locator(`tbody >> tr >> text="${order.xeroInvoiceNumber}"`)
        ).toBeVisible()
    )
  }

  async selectPaymentMethod(type: 'CC' | 'INVOICE') {
    await this.paymentMethod.click()
    await this.page
      .locator(`data-testid="payment-method-option-${type}"`)
      .click()
  }

  async waitForDownload() {
    await this.page.waitForEvent('download')
  }

  async exportWholePage() {
    await this.exportWholePageButton.click()
  }
}
