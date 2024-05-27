import { expect, Locator, Page } from '@playwright/test'

import { Course_Level_Enum } from '@app/generated/graphql'

import { waitForGraphQLResponse } from '@qa/commands'
import { mapCourseTypesToShort, toCourseTableRow } from '@qa/data/mappings'
import { Course, CourseTableRow } from '@qa/data/types'
import { CreateCourseMenu } from '@qa/fixtures/components/CreateCourseMenu.fixture'
import { RoleSwitcher } from '@qa/fixtures/components/RoleSwitcher.fixture'
import { UiTable } from '@qa/fixtures/components/UiTable.fixture'
import { UserMenu } from '@qa/fixtures/components/UserMenu.fixture'
import { sortCoursesByAllFields } from '@qa/util'

import { BasePage } from '../BasePage.fixture'

import { CourseDetailsPage } from './course-details/CourseDetailsPage.fixture'
import { CourseBuilderPage } from './CourseBuilderPage.fixture'

export class MyCoursesPage extends BasePage {
  readonly searchInput: Locator
  readonly filterBy: (text: string) => Locator
  readonly filterItem: (text: string) => Locator
  readonly tableRoot: Locator
  readonly coursesTable: UiTable
  readonly createCourseMenu: CreateCourseMenu
  readonly userMenu: UserMenu
  readonly roleSwitcher: RoleSwitcher
  readonly submitButton: Locator
  readonly dialogueConfirmButton: Locator
  readonly proceedButton: Locator
  readonly modalSubmitButton: Locator

  constructor(page: Page) {
    super(page)
    this.userMenu = new UserMenu(this.page)
    this.roleSwitcher = new RoleSwitcher(this.page)
    this.searchInput = this.page.locator('[data-testid="FilterSearch-Input"]')
    this.filterBy = (testId: string) =>
      this.page.locator(`[data-testid="${testId}"]`)
    this.filterItem = (text: string) =>
      this.page.locator(`[data-testid="filter-item"]:has-text("${text}")`)
    this.tableRoot = this.page.locator('table[data-testid="courses-table"]')
    this.coursesTable = new UiTable(this.tableRoot)
    this.createCourseMenu = new CreateCourseMenu(this.page)
    this.submitButton = this.page.locator('[data-testid="submit-button"]')
    this.dialogueConfirmButton = this.page.locator(
      '[data-testid="dialog-confirm-button"]'
    )
    this.proceedButton = this.page.locator('[data-testid="proceed-button"]')
    this.modalSubmitButton = this.page.locator(
      '[data-testid="AcceptDeclineCourse-modalSubmit"]'
    )
  }

  async goto(id?: string) {
    await super.goto(id ? `courses?q=${id}` : `courses`)
  }

  async gotoManageCourses(id?: string) {
    await super.goto(id ? `manage-courses/all?q=${id}` : `manage-courses`)
  }

  // compares the courses table rows ignoring the order
  async checkRows(courses: Course[]) {
    const expectedRows = courses.map(toCourseTableRow)
    expectedRows.sort(sortCoursesByAllFields)
    const actualRows = (await this.coursesTable.getRows({
      ignoreEmptyHeaders: true,
    })) as CourseTableRow[]
    actualRows.sort(sortCoursesByAllFields)
    actualRows.forEach(row => {
      return expect(expectedRows.indexOf(row as CourseTableRow)).toBeTruthy()
    })
  }

  async checkCourseLevelInRows(
    courseTypes: Course_Level_Enum[] = [
      Course_Level_Enum.Level_1,
      Course_Level_Enum.Level_2,
      Course_Level_Enum.Advanced,
      Course_Level_Enum.AdvancedTrainer,
      Course_Level_Enum.IntermediateTrainer,
    ]
  ) {
    const tableRows = await this.coursesTable.getRows()
    let allRowsContainCourseCode = true
    const mapCourseTypesToShortResult = mapCourseTypesToShort()
    for (const row of tableRows) {
      const shortCodes = courseTypes.map(
        type => mapCourseTypesToShortResult[type]
      )
      if (!shortCodes.some(code => code && row.Name.includes(code))) {
        allRowsContainCourseCode = false
        break
      }
    }
    expect(allRowsContainCourseCode).toBeTruthy()
  }

  async searchCourse(text: string) {
    await this.searchInput.fill(text)
  }

  async checkNumberOfTableRows(numberOfRows: number) {
    await expect(
      this.tableRoot.locator('[data-testid*="course-row"]')
    ).toHaveCount(numberOfRows)
  }

  async filterCourses(filterTestId: string, items: string[]) {
    await this.filterBy(filterTestId).click()
    for (const item of items) {
      await this.page
        .locator(`[data-testid="FilterByCourseLevel-option-${item}"]`)
        .click()
    }
  }

  async clickCourse(courseId: number): Promise<CourseBuilderPage> {
    await this.tableRoot
      .locator(
        `[data-testid=course-row-${courseId}] [data-testid=course-title]`
      )
      .click()
    return new CourseBuilderPage(this.page)
  }

  async clickCourseDetailsPage(courseId: number): Promise<CourseDetailsPage> {
    await this.tableRoot
      .locator(`[data-testid=course-row-${courseId}] [data-testid=course-code]`)
      .click()
    return new CourseDetailsPage(this.page)
  }

  async checkCourseStatus(courseId: number, status: string) {
    const courseStatusChip = this.page.locator(
      `[data-testid="course-row-${courseId}"] [data-testid="course-status-chip"] span`
    )
    await expect(courseStatusChip).toHaveText(status)
  }

  async checkCourseStartDatePresence() {
    const startDateLocator = this.page.locator(
      '[data-testid="courseBegins-label"]'
    )

    await expect(startDateLocator).toContainText('days until course begins')
  }

  async checkCourseWaitingApproval(courseId: number) {
    await expect(
      this.page.locator(
        `[data-testid="actionable-courses-table"] [data-testid="actionable-course-${courseId}"]`
      )
    ).toBeVisible()
  }
  async checkAllCourses(courseId: number) {
    await expect(
      this.page.locator(`[data-testid=course-row-${courseId}]`)
    ).toBeVisible()
  }

  async acceptCourse(courseId: number) {
    await this.page
      .locator(
        `[data-testid=actionable-course-${courseId}] [data-testid=AcceptDeclineCourse-acceptBtn]`
      )
      .click()
  }

  async goToCourseBuilder() {
    await Promise.all([
      waitForGraphQLResponse(this.page, 'update_course_trainer_by_pk'),
      this.modalSubmitButton.click(),
    ])
  }

  async submitDefaultModules() {
    await this.submitButton.click()
  }

  async confirmModules(): Promise<CourseDetailsPage> {
    await this.dialogueConfirmButton.click()
    return new CourseDetailsPage(this.page)
  }

  async confirmCourseException() {
    await this.proceedButton.click()
  }
}
