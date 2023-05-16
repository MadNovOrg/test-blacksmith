import { Locator, Page } from '@playwright/test'

import { waitForGraphQLResponse } from '../../commands'
import { CourseBuilderPage } from '../../pages/courses/CourseBuilderPage'
import { BasePage } from '../BasePage'

export class ReviewAndConfirmPage extends BasePage {
  readonly createCourseButton: Locator
  readonly courseBuilderButton: Locator

  constructor(page: Page) {
    super(page)
    this.createCourseButton = this.page.locator(
      '[data-testid="ReviewAndConfirm-submit"]'
    )
    this.courseBuilderButton = this.page.locator(
      '[data-testid="courseBuilder-button"]'
    )
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
}
