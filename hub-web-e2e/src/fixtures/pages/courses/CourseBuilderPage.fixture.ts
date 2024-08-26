import { expect, Locator, Page } from '@playwright/test'

import { InsertCourseMutation } from '@app/generated/graphql'

import { waitForGraphQLResponse } from '@qa/commands'
import { ModuleGroup } from '@qa/data/types'
import { delay, sortModulesByName } from '@qa/util'

import { BasePage } from '../BasePage.fixture'

import { CourseDetailsPage } from './course-details/CourseDetailsPage.fixture'

export class CourseBuilderPage extends BasePage {
  readonly courseInfo: Locator
  readonly draftText: Locator
  readonly availableModule: (name: string) => Locator
  readonly availableModuleNames: Locator
  readonly emptyModuleSlots: Locator
  readonly availableModuleDurations: Locator
  readonly courseModulesArea: Locator
  readonly selectedModuleNames: Locator
  readonly selectedModuleDurations: Locator
  readonly estimatedDuration: Locator
  readonly submitButton: Locator
  readonly clearButton: Locator
  readonly timeCommitmentDialog: Locator
  readonly confirmDialogSubmitButton: string

  constructor(page: Page) {
    super(page)
    this.courseInfo = this.page.locator('data-testid=course-info')
    this.draftText = this.page.locator('data-testid=draft-text')
    this.availableModule = (name: string) =>
      this.page.locator(`[data-testid="available-modules"] >> text="${name}"`)
    this.availableModuleNames = this.page.locator(
      '[data-testid="available-modules"] [data-testid="module-name"]',
    )
    this.availableModuleDurations = this.page.locator(
      '[data-testid="available-modules"] [data-testid="module-duration"]',
    )
    this.emptyModuleSlots = this.page.locator('data-testid=empty-slot')
    this.courseModulesArea = this.page.locator('data-testid=course-modules')
    this.selectedModuleNames = this.page.locator(
      '[data-testid="selected-modules"] [data-testid="module-name"]',
    )
    this.selectedModuleDurations = this.page.locator(
      '[data-testid="selected-modules"] [data-testid="module-duration"]',
    )
    this.estimatedDuration = this.page.locator('data-testid=progress-bar-label')
    this.submitButton = this.page.locator('data-testid=submit-button')
    this.clearButton = this.page.locator('data-testid=clear-button')

    this.confirmDialogSubmitButton = 'data-testid=dialog-confirm-button'
    this.timeCommitmentDialog = this.page.locator(
      'data-testid=time-commitment-dialog',
    )
  }

  async goto(courseId: string) {
    await super.goto(`courses/${courseId}/modules`)
  }

  async selectModule(modules: string[]) {
    await this.submitButton.scrollIntoViewIfNeeded()
    for (const name of modules) {
      await this.availableModule(name).click()
    }
  }

  async checkSelectedModules(modules: string[]) {
    const actualModules = await this.selectedModuleNames.allTextContents()
    expect(actualModules).toEqual(modules)
  }

  async checkSelectedModulesContain(modules: string[]) {
    const actualModules = await this.selectedModuleNames.allTextContents()
    for (const name of modules) {
      expect.soft(actualModules).toContain(name)
    }
  }

  async checkNoDraftText() {
    await expect(this.draftText).toBeHidden()
  }

  async checkDraftTextAppeared() {
    await expect(this.draftText).toHaveText(
      'Last modified less than a minute ago',
    )
  }

  async clickSubmitButton(): Promise<{
    courseDetailsPage: CourseDetailsPage
    newCourse: InsertCourseMutation['insertCourse']
  }> {
    await this.page.route(`**/v1/graphql`, async route => {
      const request = route.request()
      if (JSON.stringify(request.postDataJSON()).includes('insertCourse')) {
        const postData = request.postDataJSON()
        expect(postData).toHaveProperty('variables.course.curriculum')
      }

      await route.continue()
    })

    await this.submitButton.click()

    const resp = await this.confirmTimeCommitmentDialog()

    await expect(this.submitButton).toBeHidden()
    return {
      courseDetailsPage: new CourseDetailsPage(this.page),
      newCourse: resp,
    }
  }

  async confirmTimeCommitmentDialog() {
    if (await this.timeCommitmentDialog.isVisible()) {
      await this.timeCommitmentDialog
        .locator(this.confirmDialogSubmitButton)
        .click()
    }
    const resp = (await waitForGraphQLResponse(
      this.page,
      'insertCourse',
    )) as InsertCourseMutation

    await expect(this.timeCommitmentDialog).toBeHidden()

    return resp.insertCourse
  }

  async checkAvailableModules(modules: ModuleGroup[]) {
    await expect(this.availableModuleNames).toHaveCount(modules.length)
    const moduleNames = await this.availableModuleNames.allTextContents()
    const moduleDurations =
      await this.availableModuleDurations.allTextContents()
    const actualModules: ModuleGroup[] = []

    console.log('checking module durations')

    for (let i = 0; i < moduleNames.length; i++) {
      actualModules.push({ name: moduleNames[i], duration: moduleDurations[i] })
    }
    actualModules.sort(sortModulesByName)
    modules.sort(sortModulesByName)
    expect(actualModules).toEqual(modules)
  }

  async checkMandatoryModules(modules: ModuleGroup[]) {
    await expect(this.selectedModuleNames).toHaveCount(modules.length)
    const moduleNames = await this.selectedModuleNames.allTextContents()
    const moduleDurations = await this.selectedModuleDurations.allTextContents()
    const actualModules: ModuleGroup[] = []
    for (let i = 0; i < moduleNames.length; i++) {
      actualModules.push({
        name: `${moduleNames[i]}`,
        duration: moduleDurations[i],
      })
    }
    actualModules.sort(sortModulesByName)
    modules.sort(sortModulesByName)
    expect(actualModules).toEqual(modules)
  }

  async checkEstimatedDuration(duration: string) {
    await expect(this.estimatedDuration).toHaveText(duration)
  }

  async clickClearButton() {
    await this.clearButton.click()
    await delay(2000)
  }

  async checkModulesNotSelected(modules: string[]) {
    const actualModules = await this.selectedModuleNames.allTextContents()
    for (const name of modules) {
      expect.soft(actualModules).not.toContain(name)
    }
  }
}
