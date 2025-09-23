import { Locator, Page } from '@playwright/test'

import { waitForGraphQLResponse } from '@qa/commands'

import { BasePage } from '../BasePage.fixture'

import { CourseBuilderPage } from './CourseBuilderPage.fixture'

export class ReviewAndConfirmPage extends BasePage {
  readonly createCourseButton: Locator
  readonly courseBuilderButton: Locator
  readonly approveButton: Locator
  readonly courseName: Locator

  constructor(page: Page) {
    super(page)
    this.createCourseButton = this.page.locator(
      '[data-testid="ReviewAndConfirm-submit"]',
    )
    this.courseBuilderButton = this.page.locator(
      '[data-testid="courseBuilder-button"]',
    )
    this.approveButton = this.page.locator('button:text("Approve")')
    this.courseName = this.page.locator('[data-testid=course-name]')
  }

  async getCourseIdOnCreation(): Promise<number> {
    const responses = await Promise.all([
      waitForGraphQLResponse(this.page, 'insertCourse'),
      this.createCourseButton.click(),
    ])
    return responses[0].insertCourse.id
  }

  async getCourseIdAfterProceedingToCourseBuilder() {
    await this.courseBuilderButton.click()
    await this.page.waitForURL(/.*\/courses\/new\/modules/)

    const courseBuilderPage = new CourseBuilderPage(this.page)

    return { courseBuilderPage }
  }

  async confirmApproval() {
    await this.approveButton.click()
  }
}
