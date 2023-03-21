import { expect, Page } from '@playwright/test'

import { BasePage } from '../BasePage'

export class MembershipPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto() {
    await super.goto(`membership`)
  }

  async checkGridItem(contentTypes: string[]) {
    for (const type of contentTypes) {
      await expect(
        this.page.locator(`data-testid=${type}-grid-title`)
      ).toBeVisible()

      await expect(
        this.page.locator(`data-testid=${type}-grid >> [data-grid-item="0"]`)
      ).toBeVisible()
    }
  }
}
