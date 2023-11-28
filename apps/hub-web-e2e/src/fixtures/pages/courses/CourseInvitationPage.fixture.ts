import { expect, Locator, Page } from '@playwright/test'

import { Course_Type_Enum } from '@app/generated/graphql'

import { waitForGraphQLResponse } from '@qa/commands'
import { Course } from '@qa/data/types'

import { BasePage } from '../BasePage.fixture'

import { CourseDetailsPage } from './course-details/CourseDetailsPage.fixture'

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

  async acceptInvitation(course: Course): Promise<CourseDetailsPage> {
    if (course.type === Course_Type_Enum.Open) {
      await Promise.all([
        waitForGraphQLResponse(this.page, 'invite', '"status": "ACCEPTED"'),
        expect(this.page.locator('.MuiAlert-message')).toContainText(
          'Your response has been sent',
          { timeout: 120000 }
        ),
      ])
    } else {
      await Promise.all([
        waitForGraphQLResponse(
          this.page,
          'acceptInvite',
          '"status": "ACCEPTED"'
        ),
        this.willAttendOption.click(),
        this.continueButton.click(),
        this.waitForPageLoad(),
      ])
    }
    return new CourseDetailsPage(this.page)
  }

  async declineInvitation(note: string) {
    await this.wontAttendOption.click()
    await this.noteInput.fill(note)
    await this.continueButton.click()
  }
}
