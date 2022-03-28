import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { delay } from '../../util'
import { BasePage } from '../BasePage'

export class CourseBuilderPage extends BasePage {
  readonly courseInfo: Locator
  readonly availableModule: (name: string) => Locator
  readonly emptyModuleSlots: Locator
  readonly courseModulesArea: Locator
  readonly selectedModules: Locator

  constructor(page: Page) {
    super(page)
    this.courseInfo = this.page.locator('data-testid=course-info')
    this.availableModule = (name: string) =>
      this.page.locator(
        `[data-testid="all-modules"] [data-testid="module-name"]:has-text("${name}")`
      )
    this.emptyModuleSlots = this.page.locator('[data-testid="empty-slot"]')
    this.courseModulesArea = this.page.locator('[data-testid="course-modules"]')
    this.selectedModules = this.page.locator(
      '[data-testid="course-modules"] [data-testid="module-name"]'
    )
  }

  async goto(courseId: string) {
    await super.goto(
      `${BASE_URL}/trainer-base/course/${courseId}/modules`,
      this.courseInfo
    )
  }

  async dragModulesToRight(modules: string[]) {
    // TODO: killed 2 days on this, but couldn't make it without hard coded coordinates and delays
    for (const name of modules) {
      const sourceBox = await this.availableModule(name).boundingBox()
      await this.page.mouse.move(sourceBox.x, sourceBox.y)
      await this.page.mouse.down()
      await this.page.mouse.move(500, 200)
      await this.page.mouse.move(1300, 300)
      await this.page.mouse.up()
      await delay(2000)
    }
  }

  async checkSelectedModules(modules: string[]) {
    const actualModules = await this.selectedModules.allTextContents()
    expect(actualModules).toEqual(modules)
  }

  async checkSelectedModulesContain(modules: string[]) {
    const actualModules = await this.selectedModules.allTextContents()
    for (const name of modules) {
      expect.soft(actualModules).toContain(name)
    }
  }
}
