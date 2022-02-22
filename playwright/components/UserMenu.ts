import { expect, Locator, Page } from '@playwright/test'

export enum Option {
  ViewEditAccount = 'profile-link',
  Notifications = 'notifications-link',
  Logout = 'logout-link',
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
    this.option = text => this.page.locator(`[data-id="${text}"]`)
  }

  async selectOption(option: Option) {
    await this.userNameText.click()
    await this.option(option).click()
  }

  async checkIsVisible() {
    await expect(this.userNameText).toBeVisible({ timeout: 10000 })
  }
}
