import { expect, Locator, Page } from '@playwright/test'

import { InviteStatus, CourseLevel } from '@app/types'

import { waitForGraphQLResponse } from '../../commands'
import { CreateCourseMenu } from '../../components/CreateCourseMenu'
import { RoleSwitcher } from '../../components/RoleSwitcher'
import { UiTable } from '../../components/UiTable'
import { UserMenu } from '../../components/UserMenu'
import { mapCourseTypesToShort } from '../../data/mappings'
import { toCourseTableRow } from '../../data/mappings'
import { Course, CourseTableRow } from '../../data/types'
import { sortCoursesByAllFields } from '../../util'
import { BasePage } from '../BasePage'

import { CourseDetailsPage } from './course-details/CourseDetailsPage'
import { CourseBuilderPage } from './CourseBuilderPage'

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
    courseTypes: CourseLevel[] = [
      CourseLevel.Level_1,
      CourseLevel.Level_2,
      CourseLevel.Advanced,
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
        .locator(`[data-testid="FilterCourseLevel-option-${item}"]`)
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

  async checkCourseWaitingApproval(courseId: number) {
    await expect(
      this.page.locator(
        `[data-testid="actionable-course-${courseId}"] [data-testid="AcceptDeclineCourse-acceptBtn"]`
      )
    ).toBeVisible()

    await expect(
      this.page.locator(
        `[data-testid="actionable-course-${courseId}"] [data-testid="AcceptDeclineCourse-declineBtn"]`
      )
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
      waitForGraphQLResponse(
        this.page,
        'update_course_trainer_by_pk',
        `"status":"${InviteStatus.ACCEPTED}"`
      ),
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
