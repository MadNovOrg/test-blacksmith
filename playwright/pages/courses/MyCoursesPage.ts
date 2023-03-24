import { expect, Locator, Page } from '@playwright/test'

import { waitForGraphQLResponse } from '../../commands'
import { CreateCourseMenu } from '../../components/CreateCourseMenu'
import { RoleSwitcher } from '../../components/RoleSwitcher'
import { UiTable } from '../../components/UiTable'
import { UserMenu } from '../../components/UserMenu'
import { toCourseTableRow } from '../../data/mappings'
import { Course, CourseTableRow } from '../../data/types'
import { sortCoursesByAllFields as rowsByAllFields } from '../../util'
import { BasePage } from '../BasePage'

import { CourseBuilderPage } from './CourseBuilderPage'
import { CourseDetailsPage } from './CourseDetailsPage'

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
  }

  async goto() {
    await super.goto(`courses`)
  }

  async gotoManageCourses() {
    await super.goto(`manage-courses`)
  }

  // compares the courses table rows ignoring the order
  async checkRows(courses: Course[]) {
    await expect(this.coursesTable.rows).toHaveCount(courses.length)
    const expectedRows = courses.map(toCourseTableRow)
    expectedRows.sort(rowsByAllFields)
    const actualRows = (await this.coursesTable.getRows({
      ignoreEmptyHeaders: true,
    })) as CourseTableRow[]
    actualRows.sort(rowsByAllFields)
    actualRows.forEach(row => {
      expect(expectedRows.indexOf(row)).toBeTruthy()
    })
  }

  async searchCourse(text: string) {
    await this.searchInput.fill(text)
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
      .locator(
        `[data-testid=course-row-${courseId}] [data-testid=course-title]`
      )
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
    await this.page
      .locator('[data-testid="AcceptDeclineCourse-modalSubmit"]')
      .click()
  }

  async submitDefaultModules() {
    await this.submitButton.click()
  }

  async confirmModules() {
    await Promise.all([
      waitForGraphQLResponse(this.page, 'course', 'createdAt'),
      this.page.getByText('Confirm').click(),
    ])
    return new CourseDetailsPage(this.page)
  }

  async confirmCourseException() {
    await this.page.locator('[data-testid="proceed-button"]').click()
  }
}
