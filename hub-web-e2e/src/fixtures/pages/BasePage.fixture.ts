import { expect, Locator, Page } from '@playwright/test'

import { BASE_URL } from '@qa/constants'

export class BasePage {
  readonly page: Page
  readonly muiSkeletonPulse: Locator
  readonly muiProgressCircle: Locator

  constructor(page: Page) {
    this.page = page
    this.muiSkeletonPulse = this.page.locator('.MuiSkeleton-pulse')
    this.muiProgressCircle = this.page.locator('.MuiCircularProgress-circle')
  }
  async goto(url?: string) {
    await this.page.setViewportSize({ width: 1300, height: 1200 })
    await this.page.goto(`${BASE_URL}/${url ?? ''}`)
    await this.waitForPageLoad()
  }

  async waitForPageLoad() {
    await this.page.route('**/timezone/json*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          dstOffset: 0,
          rawOffset: -28800,
          timeZoneId: 'America/Los_Angeles',
          timeZoneName: 'Pacific Standard Time',
        }),
      })
    })

    await this.page.waitForLoadState('domcontentloaded')
    await expect(this.muiProgressCircle).toHaveCount(0)
    await expect(this.muiSkeletonPulse).toHaveCount(0)
  }

  async closeCurrentTab() {
    await this.page.close()
  }
}
