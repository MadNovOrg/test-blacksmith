import { Page } from '@playwright/test'

import { RoleSwitcher } from '../components/RoleSwitcher'
import { UserMenu } from '../components/UserMenu'
import { BASE_URL } from '../constants'

import { BasePage } from './BasePage'

export class HomePage extends BasePage {
  readonly userMenu: UserMenu
  readonly roleSwitcher: RoleSwitcher

  constructor(page: Page) {
    super(page)
    this.userMenu = new UserMenu(this.page)
    this.roleSwitcher = new RoleSwitcher(this.page)
  }

  async goto() {
    await super.goto(BASE_URL, this.userMenu.userNameText)
  }

  async tryToOpen() {
    await this.page.goto(BASE_URL)
  }
}
