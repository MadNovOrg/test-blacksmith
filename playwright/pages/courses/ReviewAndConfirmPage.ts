import { Locator, Page } from '@playwright/test'

import { waitForGraphQLResponse } from '@qa/commands'

import { BasePage } from '../BasePage'

import { CourseBuilderPage } from './CourseBuilderPage'

export class ReviewAndConfirmPage extends BasePage {
  readonly createCourseButton: Locator
  readonly courseBuilderButton: Locator
  readonly approveButton: Locator

  constructor(page: Page) {
    super(page)
    this.createCourseButton = this.page.locator(
      '[data-testid="ReviewAndConfirm-submit"]'
    )
    this.courseBuilderButton = this.page.locator(
      '[data-testid="courseBuilder-button"]'
    )
    this.approveButton = this.page.locator('button:text("Approve")')
  }

  async getCourseIdOnCreation(): Promise<number> {
    const responses = await Promise.all([
      waitForGraphQLResponse(this.page, 'insertCourse', 'inserted'),
      this.createCourseButton.click(),
    ])
    return responses[0].insertCourse.inserted[0].id
  }

  async getCourseIdAfterProceedingToCourseBuilder() {
    const responses = await Promise.all([
      waitForGraphQLResponse(this.page, 'insertCourse', 'inserted'),
      this.courseBuilderButton.click(),
    ])
    const courseBuilderPage = new CourseBuilderPage(this.page)
    const id = responses[0].insertCourse.inserted[0].id
    return { courseBuilderPage, id }
  }

  async confirmApproval() {
    if (await this.approveButton.isEnabled()) {
      await this.approveButton.click()
    }
  }
}
