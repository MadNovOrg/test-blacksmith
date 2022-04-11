import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { ModuleGroup } from '../../data/types'
import { delay, sortModulesByName } from '../../util'
import { BasePage } from '../BasePage'

import { CourseDetailsPage } from './CourseDetailsPage'

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

  constructor(page: Page) {
    super(page)
    this.courseInfo = this.page.locator('data-testid=course-info')
    this.draftText = this.page.locator('data-testid=draft-text')
    this.availableModule = (name: string) =>
      this.page.locator(`*css=[data-testid="module-card"] >> text="${name}"`)
    this.availableModuleNames = this.page.locator(
      '[data-testid="all-modules"] [data-testid="module-name"]'
    )
    this.availableModuleDurations = this.page.locator(
      '[data-testid="all-modules"] [data-testid="module-duration"]'
    )
    this.emptyModuleSlots = this.page.locator('data-testid=empty-slot')
    this.courseModulesArea = this.page.locator('data-testid=course-modules')
    this.selectedModuleNames = this.page.locator(
      '[data-testid="course-modules"] [data-testid="module-name"]'
    )
    this.selectedModuleDurations = this.page.locator(
      '[data-testid="course-modules"] [data-testid="module-duration"]'
    )
    this.estimatedDuration = this.page.locator('data-testid=progress-bar-label')
    this.submitButton = this.page.locator('data-testid=submit-button')
    this.clearButton = this.page.locator('data-testid=clear-button')
  }

  async goto(courseId: string) {
    await super.goto(`${BASE_URL}/courses/${courseId}/modules`, this.courseInfo)
  }

  async dragModulesToRight(modules: string[]) {
    await this.submitButton.scrollIntoViewIfNeeded()
    for (const name of modules) {
      const sourceBox = await this.availableModule(name).boundingBox()
      const targetBox = await this.emptyModuleSlots.first().boundingBox()
      const sourceX = sourceBox.x + sourceBox.width / 2
      const sourceY = sourceBox.y + sourceBox.height / 2
      const targetX = targetBox.x + targetBox.width / 2
      const targetY = targetBox.y + targetBox.height / 2
      await this.page.mouse.move(sourceX, sourceY)
      await this.page.mouse.down()
      // we have to move somewhere first, then to the target, otherwise won't work
      await this.page.mouse.move(sourceX + 50, sourceY)
      await this.page.mouse.move(targetX, targetY)
      await this.page.mouse.up()
      await delay(2000)
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
      'Last modified less than a minute ago'
    )
  }

  async clickSubmitButton(): Promise<CourseDetailsPage> {
    await this.submitButton.click()
    return new CourseDetailsPage(this.page)
  }

  async checkAvailableModules(modules: ModuleGroup[]) {
    await expect(this.availableModuleNames).toHaveCount(modules.length)
    const moduleNames = await this.availableModuleNames.allTextContents()
    const moduleDurations =
      await this.availableModuleDurations.allTextContents()
    const actualModules: ModuleGroup[] = []
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
      actualModules.push({ name: moduleNames[i], duration: moduleDurations[i] })
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
