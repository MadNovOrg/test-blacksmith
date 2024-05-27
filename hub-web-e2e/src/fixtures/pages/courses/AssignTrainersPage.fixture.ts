import { expect, Locator, Page } from '@playwright/test'

import { waitForGraphQLResponse } from '@qa/commands'
import { User } from '@qa/data/types'
import { searchModerator, searchTrainerLead } from '@qa/util'

import { BasePage } from '../BasePage.fixture'

import { CourseApprovalRequiredModal } from './CourseApprovalRequiredModal.fixture'
import { TrainerExpensesPage } from './TrainerExpensesPage.fixture'

export class AssignTrainersPage extends BasePage {
  readonly trainerInput: Locator
  readonly assistantInput: Locator
  readonly moderatorInput: Locator
  readonly selectedTrainer: Locator
  readonly selectedAssistants: Locator
  readonly autocompleteLoading: Locator
  readonly autocompleteOptions: Locator
  readonly trainerExpensesButton: Locator
  readonly createCourseButton: Locator
  readonly proceedButton: Locator

  constructor(page: Page) {
    super(page)
    this.trainerInput = this.page.locator(
      '[data-testid="AssignTrainers-lead"] [data-testid="SearchTrainers-input"]'
    )
    this.assistantInput = this.page.locator(
      '[data-testid="AssignTrainers-assist"] [data-testid="SearchTrainers-input"]'
    )
    this.moderatorInput = this.page.locator(
      '[data-testid="AssignTrainers-moderator"] [data-testid="SearchTrainers-input"]'
    )
    this.autocompleteLoading = this.page.locator(
      '.MuiAutocomplete-popper .MuiAutocomplete-loading'
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
    this.proceedButton = this.page.locator('data-testid=proceed-button')
  }

  async goto(courseType: string) {
    await super.goto(`courses/new?type=${courseType}`)
  }

  async removeTrainerIfAny() {
    if (await this.selectedTrainer.isVisible()) {
      await this.selectedTrainer.locator('data-testid=CancelIcon').click()
    }
  }

  async selectTrainer(trainer: User) {
    const searchStrings = ['SearchTrainer', 'LEADER']
    await this.trainerInput.click()
    await this.trainerInput.fill(trainer.givenName)

    await this.page.route(`**/v1/graphql`, async route => {
      const request = route.request()
      if (
        searchStrings.every(str =>
          JSON.stringify(request.postDataJSON()).includes(str)
        )
      ) {
        await route.fulfill({
          json: searchTrainerLead(),
        })
      } else {
        await route.continue()
      }
    })

    await this.trainerInput.click()
    await expect(this.autocompleteLoading).toHaveCount(0)
    await this.page.keyboard.press('ArrowDown')
    await this.page.keyboard.press('Enter')
  }

  async selectAssistantTrainer(trainer: User) {
    await this.assistantInput.fill(trainer.givenName)
    await this.page.waitForResponse(
      resp => resp.url().includes('/v1/graphql') && resp.status() === 200
    )
    await this.assistantInput.click()
    await expect(this.autocompleteLoading).toHaveCount(0)
    await this.page.keyboard.press('ArrowDown')
    await this.page.keyboard.press('Enter')
  }

  async selectModerator(trainer: User, reaccredidation: boolean) {
    if (!reaccredidation) {
      const searchStrings = ['SearchTrainer', 'MODERATOR']
      await this.moderatorInput.click()
      await this.moderatorInput.fill(trainer.givenName)

      await this.page.route(`**/v1/graphql`, async route => {
        const request = route.request()
        if (
          searchStrings.every(str =>
            JSON.stringify(request.postDataJSON()).includes(str)
          )
        ) {
          await route.fulfill({
            json: searchModerator(),
          })
        } else {
          await route.continue()
        }
      })

      await this.moderatorInput.click()
      await expect(this.autocompleteLoading).toHaveCount(0)
      await this.page.keyboard.press('ArrowDown')
      await this.page.keyboard.press('Enter')
    }
  }

  async clickTrainerExpensesButton() {
    await expect(this.trainerExpensesButton).toBeEnabled()
    await this.trainerExpensesButton.click()
    const approvalExceptionModal = new CourseApprovalRequiredModal(this.page)
    await approvalExceptionModal.confirmCourseException()
    return new TrainerExpensesPage(this.page)
  }

  async getCourseIdOnCreation(): Promise<number> {
    const responses = await Promise.all([
      waitForGraphQLResponse(this.page, 'insertCourse'),
      this.createCourseButton.click(),
    ])
    return responses[0].insertCourse.id
  }
}
