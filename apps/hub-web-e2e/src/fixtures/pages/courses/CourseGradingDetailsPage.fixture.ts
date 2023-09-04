import { expect, Locator, Page } from '@playwright/test'

import { BasePage } from '../BasePage.fixture'

import { CourseDetailsPage } from './course-details/CourseDetailsPage.fixture'

export class CourseGradingDetailsPage extends BasePage {
  readonly confirmModules: Locator
  readonly continueToAttendees: Locator

  constructor(page: Page) {
    super(page)
    this.confirmModules = this.page.locator(
      'text=Confirm modules and physical techniques'
    )
    this.continueToAttendees = this.page.locator(
      'text=Continue to grading attendees'
    )
  }

  async goto(courseId: string) {
    await super.goto(`courses/${courseId}/grading-details`)
  }

  async clickParticipantByName(name: string) {
    await this.page.locator(`text="${name}"`).click()
  }

  async checkSelected(length: number) {
    await expect(this.page.locator(`text=${length - 1} selected`)).toBeVisible()
  }

  async clickConfirmModules() {
    await this.confirmModules.click()
  }

  async clickModules(moduleGroupName: string) {
    await this.page.click(`text=${moduleGroupName}`)
  }

  async clickContinueToAttendees(): Promise<CourseDetailsPage> {
    await this.continueToAttendees.click()
    return new CourseDetailsPage(this.page)
  }
}
