import { expect, Locator, Page } from '@playwright/test'

import { CourseType } from '../../src/types'
import { CreateCoursePage } from '../pages/courses/CreateCoursePage'

export class CreateCourseMenu {
  readonly page: Page
  readonly createCourseButton: Locator
  readonly option: (text: string) => Locator

  constructor(page: Page) {
    this.page = page
    this.createCourseButton = this.page.locator(
      'data-testid=create-course-menu-button'
    )
    this.option = text => this.page.locator(`data-testid="${text}"`)
  }

  async clickCreateCourseButton() {
    await this.createCourseButton.click()
  }

  async selectCreateCourseOption(type: CourseType): Promise<CreateCoursePage> {
    await this.createCourseButton.click()
    await this.option(`create-course-${type}`).click()
    return new CreateCoursePage(this.page)
  }

  async selectBulkImportOption() {
    await this.createCourseButton.click()
    await this.option('bulk-import-option').click()
  }

  async checkIsVisible() {
    await expect(this.createCourseButton).toBeVisible({ timeout: 20000 })
  }
}
