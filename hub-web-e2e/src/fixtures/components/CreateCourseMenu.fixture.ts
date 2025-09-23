import { expect, Locator, Page } from '@playwright/test'

import { Course_Type_Enum } from '@app/generated/graphql'

import { CreateCoursePage } from '@qa/fixtures/pages/courses/CreateCoursePage.fixture'

export class CreateCourseMenu {
  readonly page: Page
  readonly createCourseButton: Locator
  readonly option: (text: string) => Locator

  constructor(page: Page) {
    this.page = page
    this.createCourseButton = this.page.locator(
      'data-testid=create-course-menu-button',
    )
    this.option = text => this.page.locator(`data-testid=${text}`)
  }

  async clickCreateCourseButton(): Promise<CreateCoursePage> {
    await this.createCourseButton.click()
    return new CreateCoursePage(this.page)
  }

  async selectCreateCourseOption(
    type: Course_Type_Enum,
  ): Promise<CreateCoursePage> {
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
