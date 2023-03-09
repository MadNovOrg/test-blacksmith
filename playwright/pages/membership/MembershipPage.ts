import { expect, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

export class MembershipPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto() {
    await super.goto(`${BASE_URL}/membership`)
  }

  async checkGridItem(type: string) {
    await expect(
      this.page.locator(`data-testid=${type}-grid-title`)
    ).toBeVisible()

    await expect(
      this.page.locator(`data-testid=${type}-grid >> [data-grid-item="0"]`)
    ).toBeVisible()
  }
}
