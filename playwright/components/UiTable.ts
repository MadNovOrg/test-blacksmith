import { expect, Locator } from '@playwright/test'

type TableRow = Record<string, string>

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
  ): Promise<TableRow[]> {
    const result: TableRow[] = []
    await this.root.scrollIntoViewIfNeeded()
    const headers = await this.getHeaders({
      ignoreEmpty: options.ignoreEmptyHeaders,
    })
    const rowsCount = await this.getRowsCount()
    if (!(await this.emptyTable.isVisible())) {
      for (let i = 0; i < rowsCount; i++) {
        const resultRow: { [k: string]: string } = {}
        for (let j = 0; j < headers.length; j++) {
          resultRow[headers[j]] = (await this.rows
            .nth(i)
            .locator('td')
            .nth(j)
            .textContent()) as string
        }
        result.push(resultRow)
      }
    }
    return result
  }

  async checkIsVisible() {
    await expect(this.root).toBeVisible({ timeout: 20000 })
  }

  /**
   * Gets the cell locator.
   * Row is defined by column name and the predicate function to match with the row we need.
   * Column is defined by column name.
   * @param idColumnName column name where the row identifier is
   * @param match predicate that defines whether the cell matches the ID (i.e. contains a link with course ID)
   * @param columnName column name we need to take the cell from
   */
  async getCell(
    idColumnName: string,
    match: (cell: Locator) => Promise<boolean>,
    columnName: string
  ): Promise<Locator> {
    const headers = await this.getHeaders()
    const columnIndex = headers.indexOf(idColumnName)
    const rowsCount = await this.getRowsCount()
    const idCells = []
    for (let i = 0; i < rowsCount; i++) {
      const idCell = this.rows.nth(i).locator('td').nth(columnIndex)
      if (await match(idCell)) {
        return this.rows.nth(i).locator('td').nth(headers.indexOf(columnName))
      }
      idCells.push(await idCell.innerHTML())
    }
    throw Error(
      `No cell found with match "${match.toString()}" under column "${idColumnName}"
      Cells inner HTML:
      ${idCells.join('\n')}`
    )
  }

  async getCellWithText(columnName: string, text: string): Promise<Locator> {
    const headers = await this.getHeaders()
    const columnIndex = headers.indexOf(columnName)
    const rowsCount = await this.getRowsCount()
    for (let i = 0; i < rowsCount; i++) {
      const cell = this.rows.nth(i).locator('td').nth(columnIndex)
      if (((await cell.textContent()) as string).includes(text)) {
        return cell
      }
    }
    throw Error(`No cell found with text "${text}"`)
  }
}
