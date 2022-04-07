import { Locator, Page } from '@playwright/test'

import { ResetPasswordPage } from './auth/ResetPasswordPage'
import { CourseInvitationPage } from './courses/CourseInvitationPage'

const url = 'http://email'

export class EmailPage {
  readonly page: Page
  readonly resetPasswordLink: Locator
  readonly registerNowButton: Locator

  constructor(page: Page) {
    this.page = page
    this.resetPasswordLink = this.page.locator('text="Reset Your Password"')
    this.registerNowButton = this.page.locator('text="Register Now"')
  }

  async renderContent(content: string) {
    await this.page.route(url, route => {
      route.fulfill({ body: content })
    })
    await this.page.goto(url)
  }

  async clickResetPasswordLink(): Promise<ResetPasswordPage> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.resetPasswordLink.click(),
    ])
    await newPage.waitForLoadState()
    return new ResetPasswordPage(newPage)
  }

  async clickRegisterNowButton(): Promise<CourseInvitationPage> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.registerNowButton.click(),
    ])
    await newPage.waitForLoadState()
    return new CourseInvitationPage(newPage)
  }
}
