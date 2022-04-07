import { Locator, Page } from '@playwright/test'

import { LoginPage } from '../auth/LoginPage'
import { BasePage } from '../BasePage'

export class CourseInvitationPage extends BasePage {
  readonly willAttendOption: Locator
  readonly wontAttendOption: Locator
  readonly noteInput: Locator
  readonly continueButton: Locator

  constructor(page: Page) {
    super(page)
    this.willAttendOption = this.page.locator('data-testid=will-attend')
    this.wontAttendOption = this.page.locator('data-testid=wont-attend')
    this.noteInput = this.page.locator('#note')
    this.continueButton = this.page.locator('data-testid=login-submit')
  }

  async acceptInvitation(): Promise<LoginPage> {
    await this.willAttendOption.click()
    await this.continueButton.click()
    return new LoginPage(this.page)
  }

  async declineInvitation(note: string) {
    await this.wontAttendOption.click()
    await this.noteInput.fill(note)
    await this.continueButton.click()
  }
}
