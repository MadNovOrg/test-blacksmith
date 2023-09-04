import { expect, Locator } from '@playwright/test'

import { CourseTableRow } from '@qa/data/types'

export class UiTable {
  readonly root: Locator
  readonly headers: Locator
  readonly rows: Locator
  readonly firstRow: Locator
  readonly firstRowCells: Locator
  readonly emptyTable: Locator

  constructor(root: Locator) {
    this.root = root
    this.headers = this.root.locator('th')
    this.rows = this.root.locator('tbody tr')
    this.emptyTable = this.root.locator('tbody tr[data-testid="TableNoRows"]')
    this.firstRowCells = this.root.locator('tbody tr >> nth=0 >> td')
    this.firstRow = this.root.locator('tbody tr >> nth=0')
  }

  async getRowsCount(): Promise<number> {
    await this.checkIsVisible()
    return this.rows.count()
  }

  async getHeaders(
    options: { ignoreEmpty?: boolean } = { ignoreEmpty: false }
  ): Promise<string[]> {
    const result = (await this.headers.allTextContents()).map(h =>
      h.replace('sorted ascending', '')
    )
    return options.ignoreEmpty ? result.filter(h => h !== '') : result
  }

  async getRows(
    options: { ignoreEmptyHeaders?: boolean } = { ignoreEmptyHeaders: false }
  ): Promise<CourseTableRow[]> {
    const result: CourseTableRow[] = []
    await this.root.scrollIntoViewIfNeeded()
    const headers = await this.getHeaders({
      ignoreEmpty: options.ignoreEmptyHeaders,
    })
    // Remove blank headings
    const filteredHeaders = headers.filter(header => header.trim() !== '')

    const rowsCount = await this.getRowsCount()
    if (!(await this.emptyTable.isVisible())) {
      for (let i = 0; i < rowsCount; i++) {
        const resultRow: { [k: string]: string } = {}
        for (let j = 0; j < filteredHeaders.length; j++) {
          resultRow[filteredHeaders[j]] = (await this.rows
            .nth(i)
            .locator('td')
            .nth(j)
            .textContent()) as string
        }
        result.push(resultRow as CourseTableRow)
      }
    }
    return result
  }

  async checkIsVisible() {
    await expect(this.root).toBeVisible({ timeout: 20000 })
  }
}
