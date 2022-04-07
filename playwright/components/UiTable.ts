import { expect, Locator } from '@playwright/test'

export class UiTable {
  readonly root: Locator
  readonly headers: Locator
  readonly rows: Locator
  readonly firstRowCells: Locator

  constructor(root: Locator) {
    this.root = root
    this.headers = this.root.locator('th')
    this.rows = this.root.locator('tbody tr')
    this.firstRowCells = this.root.locator('tbody tr >> nth=0 >> td')
  }

  async waitToLoad() {
    const headersCount = await this.headers.count()
    await expect(this.firstRowCells).toHaveCount(headersCount)
  }

  async getRowsCount(): Promise<number> {
    await this.waitToLoad()
    return this.rows.count()
  }

  async getHeaders(): Promise<string[]> {
    return (await this.headers.allTextContents()).map(h =>
      h.replace('sorted ascending', '')
    )
  }

  async getRows(): Promise<object> {
    const result = []
    const headers = await this.getHeaders()
    const rowsCount = await this.getRowsCount()
    for (let i = 0; i < rowsCount; i++) {
      const resultRow = {}
      for (let j = 0; j < headers.length; j++) {
        resultRow[headers[j]] = await this.rows
          .nth(i)
          .locator('td')
          .nth(j)
          .textContent()
      }
      result.push(resultRow)
    }
    return result
  }

  async checkIsVisible() {
    await expect(this.root).toBeVisible({ timeout: 20000 })
  }

  async getCell(
    idColumnName: string,
    idValue: string,
    columnName: string
  ): Promise<Locator> {
    const headers = await this.getHeaders()
    const columnIndex = headers.indexOf(idColumnName)
    const rowsCount = await this.getRowsCount()
    for (let i = 0; i < rowsCount; i++) {
      const idCell = this.rows.nth(i).locator('td').nth(columnIndex)
      if ((await idCell.textContent()).includes(idValue)) {
        return this.rows.nth(i).locator('td').nth(headers.indexOf(columnName))
      }
    }
    throw Error(
      `No cell found with text "${idValue}" under column "${idColumnName}"`
    )
  }

  async getCellWithText(columnName: string, text: string): Promise<Locator> {
    const headers = await this.getHeaders()
    const columnIndex = headers.indexOf(columnName)
    const rowsCount = await this.getRowsCount()
    for (let i = 0; i < rowsCount; i++) {
      const cell = this.rows.nth(i).locator('td').nth(columnIndex)
      if ((await cell.textContent()).includes(text)) {
        return cell
      }
    }
    throw Error(`No cell found with text "${text}"`)
  }
}
