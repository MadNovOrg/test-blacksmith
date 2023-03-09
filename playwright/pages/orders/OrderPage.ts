import { Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

export class OrderPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto() {
    await super.goto(`${BASE_URL}/orders`)
  }

  async checkInvoiceVisible(invoiceNumber: string) {
    await expect(
      this.page.locator(`tbody >> tr >> text="${invoiceNumber}"`)
    ).toBeVisible()
  }

  async selectPaymentMethod(type: 'Credit card' | 'Invoice') {
    await this.page.click('text="Payment Method"')
    await this.page.click(`text="${type}"`)
  }

  async waitForDownload() {
    await this.page.waitForEvent('download')
  }

  async exportWholePage() {
    await this.page.click('button:has-text("Export whole page")')
  }
}
