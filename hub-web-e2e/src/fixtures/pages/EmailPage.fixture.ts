import { Locator, Page } from '@playwright/test'

import { ResetPasswordPage } from './auth/ResetPasswordPage.fixture'
import { CourseInvitationPage } from './courses/CourseInvitationPage.fixture'
import { OrgInvitationPage } from './org/OrgInvitePage.fixture'

const url = 'http://email'

export class EmailPage {
  readonly page: Page
  readonly resetPasswordLink: Locator
  readonly registerNowButton: Locator
  readonly acceptInviteButton: Locator

  constructor(page: Page) {
    this.page = page
    this.resetPasswordLink = this.page.locator('text="Reset Password"')
    this.registerNowButton = this.page.locator('text="Register Now"')
    this.acceptInviteButton = this.page.locator('text="Accept/Deny"')
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
      this.page.waitForLoadState(),
    ])
    return new CourseInvitationPage(newPage)
  }

  async clickJoinOrganisationButton(): Promise<OrgInvitationPage> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.acceptInviteButton.click(),
    ])
    await newPage.waitForLoadState()
    return new OrgInvitationPage(newPage)
  }
}
