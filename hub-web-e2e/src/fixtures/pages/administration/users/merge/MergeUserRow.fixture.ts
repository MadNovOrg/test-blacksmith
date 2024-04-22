import { Locator } from '@playwright/test'

export class MergeUserRow {
  constructor(private readonly row: Locator) {}

  readonly checkbox = this.row.getByRole('checkbox')
  readonly name = this.row.locator('td:nth-child(2) a')
  readonly email = this.row.locator('td:nth-child(3)')
  readonly organizations = this.row.locator('td:nth-child(4) > a')
  readonly roles = this.row.locator('td:nth-child(6) span')
  readonly trainerTypes = this.row.locator('td:nth-child(7) span')
}
