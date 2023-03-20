import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { User } from '../../data/types'
import { BasePage } from '../BasePage'

import { TrainerExpensesPage } from './TrainerExpensesPage'

export class AssignTrainersPage extends BasePage {
  readonly trainerInput: Locator
  readonly assistantInput: Locator
  readonly selectedTrainer: Locator
  readonly selectedAssistants: Locator
  readonly autocompleteOptions: Locator
  readonly trainerExpensesButton: Locator
  readonly createCourseButton: Locator

  constructor(page: Page) {
    super(page)
    this.trainerInput = this.page.locator(
      '[data-testid="AssignTrainers-lead"] [data-testid="SearchTrainers-input"]'
    )
    this.assistantInput = this.page.locator(
      '[data-testid="AssignTrainers-assist"] [data-testid="SearchTrainers-input"]'
    )
    this.autocompleteOptions = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-option'
    )
    this.selectedTrainer = this.page.locator(
      '[data-testid="AssignTrainers-lead"] [data-testid="SearchTrainers-selected"]'
    )
    this.selectedAssistants = this.page.locator(
      '[data-testid="AssignTrainers-assist"] [data-testid="SearchTrainers-selected"]'
    )
    this.trainerExpensesButton = this.page.locator(
      '[data-testid="AssignTrainers-submit"]:text("Trainer expenses")'
    )
    this.createCourseButton = this.page.locator(
      '[data-testid="AssignTrainers-submit"]:text("Create course")'
    )
  }

  async goto(courseType: string) {
    await super.goto(`${BASE_URL}/courses/new?type=${courseType}`)
  }

  async removeTrainerIfAny() {
    if (await this.selectedTrainer.isVisible()) {
      await this.selectedTrainer.locator('data-testid=CancelIcon').click()
    }
  }

  async selectTrainer(trainer: User) {
    await this.trainerInput.type(`${trainer.givenName}`)
    await expect(this.autocompleteOptions).toHaveCount(1)
    await this.autocompleteOptions.first().click()
  }

  async clickTrainerExpensesButton() {
    await this.trainerExpensesButton.click()
    return new TrainerExpensesPage(this.page)
  }

  async getOrderIdAfterClickingCreateCourseButton(): Promise<number> {
    const responses = await Promise.all([
      this.page.waitForResponse(
        res =>
          res.request().url().includes('/graphql') &&
          (res.request().postData() as string).includes('insert_course')
      ),
      this.createCourseButton.click(),
    ])
    const data = await responses[0].json()
    return data.data.insertCourse.inserted[0].id
  }
}
