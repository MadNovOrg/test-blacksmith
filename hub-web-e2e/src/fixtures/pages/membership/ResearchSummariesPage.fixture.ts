import { expect, Locator, Page } from '@playwright/test'

import { PER_PAGE } from '@qa/constants'

import { BasePage } from '../BasePage.fixture'

export class ResearchSummariesPage extends BasePage {
  readonly downloadResource: Locator
  readonly featuredImage: Locator
  readonly pagination: Locator

  constructor(page: Page) {
    super(page)
    this.downloadResource = this.page.locator(
      `data-testid=featured-research-summary >> text="Download resource"`
    )
    this.featuredImage = this.page.locator(
      '[data-testid="featured-research-summary"] img'
    )
    this.pagination = this.page.locator(
      'data-testid=research-summaries-pagination'
    )
  }

  async goto() {
    await super.goto(`membership/research-summaries`)
  }

  async checkFeaturedImage(source: string) {
    await expect(this.featuredImage).toHaveAttribute('src', source)
  }

  async checkTitle(title: string) {
    await expect(
      this.page.locator(
        `data-testid=featured-research-summary >> text="${title}"`
      )
    ).toBeVisible()
  }

  async checkGridItem(id: string) {
    await expect(
      this.page.locator(`data-testid=research-summary-grid-item-${id}`)
    ).toBeVisible()
  }

  async checkDownload() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadResource.click(),
    ])

    const path = await download.path()
    await expect(path).toBeTruthy()
  }

  async checkPagination(length: number) {
    if (length > PER_PAGE) {
      await expect(this.pagination).toBeVisible()
    }
  }
}
