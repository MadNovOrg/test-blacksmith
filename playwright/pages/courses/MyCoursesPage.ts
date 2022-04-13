import { expect, Locator, Page } from '@playwright/test'

import { UiTable } from '../../components/UiTable'
import { BASE_URL } from '../../constants'
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

  constructor(page: Page) {
    super(page)
    this.searchInput = this.page.locator('[data-testid="search"] input')
    this.filterBy = (text: string) =>
      this.page.locator(`[data-testid="filter-by"]:has-text("${text}")`)
    this.filterItem = (text: string) =>
      this.page.locator(`[data-testid="filter-item"]:has-text("${text}")`)
    this.tableRoot = this.page.locator('table[data-testid="courses-table"]')
    this.coursesTable = new UiTable(this.tableRoot)
  }

  async goto() {
    await super.goto(`${BASE_URL}/courses`, this.tableRoot)
    await this.coursesTable.waitToLoad()
  }

  // compares the courses table rows ignoring the order
  async checkRows(courses: Course[]) {
    await expect(this.coursesTable.rows).toHaveCount(courses.length)
    const expectedRows = courses.map(toCourseTableRow)
    expectedRows.sort(rowsByAllFields)
    const actualRows = (await this.coursesTable.getRows()) as CourseTableRow[]
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
      async cell => {
        return (await cell.locator('a').getAttribute('href')).includes(
          `/${courseId}/`
        )
      },
      ''
    )
    await cell.locator('button').click()
    return new CourseBuilderPage(this.page)
  }

  async clickCourseManageButton(courseId: number): Promise<CourseDetailsPage> {
    const cell = await this.coursesTable.getCell(
      'Course Name',
      async cell => {
        return (await cell.locator('a').getAttribute('href')).includes(
          `/${courseId}/`
        )
      },
      ''
    )
    await cell.locator('button').click()
    return new CourseDetailsPage(this.page)
  }

  async checkCourseStatus(courseId: number, status: string) {
    const cell = await this.coursesTable.getCell(
      'Course Name',
      async cell => {
        return (await cell.locator('a').getAttribute('href')).includes(
          `/${courseId}/`
        )
      },
      'Status'
    )
    await expect(cell).toHaveText(status)
  }
}
