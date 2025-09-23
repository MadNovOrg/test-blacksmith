import { expect } from '@playwright/test'

import { BasePage } from '../BasePage.fixture'

import { CourseDetailsPage } from './course-details/CourseDetailsPage.fixture'

export class AcceptCoursePage extends BasePage {
  acceptConfirmationAlert = this.page.getByText(
    'You are now attending this course. Please complete the checklist.',
  )
  async gotoAccept(courseId: number, inviteId: string) {
    await super.goto(`accept-invite/${inviteId}?courseId=${courseId}`)
  }

  async waitForAcceptConfirmation() {
    await expect(this.acceptConfirmationAlert).toBeVisible()
    return new CourseDetailsPage(this.page)
  }
}
