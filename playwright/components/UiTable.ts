import { expect, Locator } from '@playwright/test'

export class UiTable {
  readonly root: Locator
  readonly headers: Locator
  readonly rows: Locator

  constructor(root: Locator) {
    this.root = root
    this.headers = this.root.locator('th')
    this.rows = this.root.locator('tbody tr')
  }

  async getHeaders(): Promise<string[]> {
    return (await this.headers.allTextContents()).map(h =>
      h.replace('sorted ascending', '')
    )
  }

  async getRows(): Promise<object> {
    const result = []
    const headers = await this.getHeaders()
    const rowsCount = await this.rows.count()
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
}
