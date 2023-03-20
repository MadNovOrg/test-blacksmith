import { Locator, Page } from '@playwright/test'

import { waitForGraphQLResponse } from '../../commands'
import { CourseDetailsPage } from '../../pages/courses/CourseDetailsPage'
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

  async acceptInvitation(): Promise<CourseDetailsPage> {
    await Promise.all([
      waitForGraphQLResponse(this.page, 'acceptInvite', '"status": "ACCEPTED"'),
      this.willAttendOption.click(),
      this.continueButton.click(),
      this.waitForPageLoad(),
    ])
    return new CourseDetailsPage(this.page)
  }

  async declineInvitation(note: string) {
    await this.wontAttendOption.click()
    await this.noteInput.fill(note)
    await this.continueButton.click()
  }
}
