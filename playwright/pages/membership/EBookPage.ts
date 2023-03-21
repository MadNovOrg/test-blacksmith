import { expect, Locator, Page } from '@playwright/test'

import { PER_PAGE } from '../../constants'
import { BasePage } from '../BasePage'

export class EBookPage extends BasePage {
  readonly downloadResource: Locator
  readonly featuredEBook: Locator
  readonly pagination: Locator

  constructor(page: Page) {
    super(page)
    this.downloadResource = this.page.locator(
      `data-testid=featured-ebook >> text="Download resource"`
    )
    this.featuredEBook = this.page.locator('[data-testid="featured-ebook"] img')
    this.pagination = this.page.locator('data-testid=ebooks-pagination')
  }

  async goto() {
    await super.goto(`membership/ebooks`)
  }

  async featuredImage(source: string) {
    await expect(this.featuredEBook).toHaveAttribute('src', source)
  }

  async featuredTitle(title: string) {
    await expect(
      this.page.locator(`data-testid=featured-ebook >> text="${title}"`)
    ).toBeVisible()
  }

  async checkGridItem(id: string) {
    await expect(
      this.page.locator(`data-testid=ebook-grid-item-${id}`)
    ).toBeVisible()
  }

  async checkDownload() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadResource.click(),
    ])
    const path = await download.path()
    await expect(path).toBeTruthy() // to be downloaded basically
  }

  async checkPagination(length: number) {
    if (length > PER_PAGE) {
      await expect(this.pagination).toBeVisible()
    }
  }
}
