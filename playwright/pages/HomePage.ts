import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../constants'

import { BasePage } from './BasePage'

export class HomePage extends BasePage {
  readonly userNameText: Locator

  constructor(page: Page) {
    super(page)
    this.userNameText = this.page.locator(
      'button[data-id="user-menu-btn"] > div'
    )
  }

  async goto(): Promise<HomePage> {
    await super.goto(BASE_URL, this.userNameText)
    return this
  }

  async openUserMenu(): Promise<HomePage> {
    await this.userNameText.click()
    return this
  }

  async checkHomePageOpened(): Promise<HomePage> {
    await expect(this.userNameText).toBeVisible()
    return this
  }
}
