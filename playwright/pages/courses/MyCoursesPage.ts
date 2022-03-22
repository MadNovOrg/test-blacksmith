import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '../../constants'
import { BasePage } from '../BasePage'
import { UiTable } from '../../components/UiTable'
import { Course } from '../../data/types'
import { toCourseTableRow } from '../../data/mappings'

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
    await super.goto(`${BASE_URL}/trainer-base/course`, this.tableRoot)
  }

  async checkRows(courses: Course[]) {
    await expect(this.coursesTable.rows).toHaveCount(courses.length)
    const expectedRows = courses.map(toCourseTableRow)
    const actualRows = await this.coursesTable.getRows()
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
}
