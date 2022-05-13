import { expect, Locator, Page } from '@playwright/test'

import { CreateCourseMenu } from '../../components/CreateCourseMenu'
import { RoleSwitcher } from '../../components/RoleSwitcher'
import { UiTable } from '../../components/UiTable'
import { UserMenu } from '../../components/UserMenu'
import { BASE_URL } from '../../constants'
import { toCourseTableRow } from '../../data/mappings'
import { Course, CourseTableRow } from '../../data/types'
import { sortCoursesByAllFields as rowsByAllFields } from '../../util'
import { BasePage } from '../BasePage'

import { CourseBuilderPage } from './CourseBuilderPage'
import { CourseDetailsPage } from './CourseDetailsPage'

const cellLinkContainsCourseId: (
  id: number
) => (cell: Locator) => Promise<boolean> = (id: number) => {
  return async cell => {
    const link = (await cell.locator('a').getAttribute('href')) as string
    return link.includes(`/${id}/`)
  }
}

export class MyCoursesPage extends BasePage {
  readonly searchInput: Locator
  readonly filterBy: (text: string) => Locator
  readonly filterItem: (text: string) => Locator
  readonly tableRoot: Locator
  readonly coursesTable: UiTable
  readonly createCourseMenu: CreateCourseMenu
  readonly userMenu: UserMenu
  readonly roleSwitcher: RoleSwitcher

  constructor(page: Page) {
    super(page)
    this.userMenu = new UserMenu(this.page)
    this.roleSwitcher = new RoleSwitcher(this.page)
    this.searchInput = this.page.locator('[data-testid="search"] input')
    this.filterBy = (text: string) =>
      this.page.locator(`[data-testid="filter-by"]:has-text("${text}")`)
    this.filterItem = (text: string) =>
      this.page.locator(`[data-testid="filter-item"]:has-text("${text}")`)
    this.tableRoot = this.page.locator('table[data-testid="courses-table"]')
    this.coursesTable = new UiTable(this.tableRoot)
    this.createCourseMenu = new CreateCourseMenu(this.page)
  }

  async goto() {
    await super.goto(`${BASE_URL}/courses`, this.tableRoot)
    await this.coursesTable.waitToLoad()
  }

  async tryToOpen() {
    await this.page.goto(BASE_URL)
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
    expect(actualRows).toEqual(expectedRows)
  }

  async searchCourse(text: string) {
    await this.searchInput.fill(text)
  }

  async filterCourses(filterByText: string, items: string[]) {
    await this.filterBy(filterByText).click()
    for (const item of items) {
      await this.filterItem(item).click()
    }
  }

  async clickCourseBuildButton(courseId: number): Promise<CourseBuilderPage> {
    const cell = await this.coursesTable.getCell(
      'Course Name',
      cellLinkContainsCourseId(courseId),
      ''
    )
    await cell.locator('button').click()
    return new CourseBuilderPage(this.page)
  }

  async clickCourseManageButton(courseId: number): Promise<CourseDetailsPage> {
    const cell = await this.coursesTable.getCell(
      'Course Name',
      cellLinkContainsCourseId(courseId),
      ''
    )
    await cell.locator('button').click()
    return new CourseDetailsPage(this.page)
  }

  async checkCourseStatus(courseId: number, status: string) {
    const courseStatusChip = this.page.locator(
      `[data-testid="course-row-${courseId}"] [data-testid="course-status-chip"] span`
    )

    await expect(courseStatusChip).toHaveText(status)
  }
}
