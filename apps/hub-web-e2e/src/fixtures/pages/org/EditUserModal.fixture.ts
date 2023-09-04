import { Locator, Page } from '@playwright/test'

export class EditUserModal {
  readonly page: Page
  readonly removeFromOrganisation: Locator

  constructor(page: Page) {
    this.page = page
    this.removeFromOrganisation = this.page.locator(
      '[data-testid=remove-from-organization]'
    )
  }

  async clickRemoveFromOrganisation() {
    await this.removeFromOrganisation.click()
  }
}
