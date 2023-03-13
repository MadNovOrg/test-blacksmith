import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'

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
    await super.goto(`${BASE_URL}/courses/${courseId}/grading-details`)
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

  async clickContinueToAttendees() {
    await this.continueToAttendees.click()
  }
}
