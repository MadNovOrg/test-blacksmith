import { Page } from '@playwright/test'

import { BasePage } from '../BasePage.fixture'

export class DiscountsPage extends BasePage {
  readonly createDiscountButton = this.page.getByRole('button', {
    name: /create discount/i,
  })

  constructor(page: Page) {
    super(page)
  }

  async goto() {
    await super.goto('admin/discounts/')
  }
}
