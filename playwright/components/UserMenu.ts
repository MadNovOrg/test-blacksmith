import { expect, Locator, Page } from '@playwright/test'

export enum Option {
  MyTrainings = 'My Trainings',
  MyOrganization = 'My Organization',
  Logout = 'Logout',
}

export class UserMenu {
  readonly page: Page
  readonly userNameText: Locator
  readonly option: (text: string) => Locator

  constructor(page: Page) {
    this.page = page
    this.userNameText = this.page.locator(
      'button[data-id="user-menu-btn"] > div'
    )
    this.option = text =>
      this.page.locator(`button[role="menuitem"]:has-text("${text}")`)
  }

  async selectOption(option: Option) {
    await this.userNameText.click()
    await this.option(option).click()
  }

  async checkIsVisible() {
    await expect(this.userNameText).toBeVisible()
  }
}
