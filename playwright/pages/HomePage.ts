import { Page } from '@playwright/test'

import { UserMenu } from '../components/UserMenu'
import { BASE_URL } from '../constants'

import { BasePage } from './BasePage'

export class HomePage extends BasePage {
  readonly userMenu: UserMenu

  constructor(page: Page) {
    super(page)
    this.userMenu = new UserMenu(this.page)
  }

  async goto() {
    await super.goto(BASE_URL, this.userMenu.userNameText)
  }

  async tryToOpen() {
    await this.page.goto(BASE_URL)
  }
}
