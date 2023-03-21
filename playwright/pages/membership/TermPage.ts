import { expect, Locator, Page } from '@playwright/test'

import { getCategoryById, getTagById } from '../../api/hasura-api'
import { PER_PAGE } from '../../constants'
import { BasePage } from '../BasePage'

export class TermPage extends BasePage {
  readonly downloadResource: Locator
  readonly featuredEBook: Locator
  readonly pagination: Locator

  constructor(page: Page) {
    super(page)
    this.downloadResource = this.page.locator(
      `data-testid=featured-ebook >> text="Download resource"`
    )
    this.featuredEBook = this.page.locator('[data-testid="featured-ebook"] img')
    this.pagination = this.page.locator('data-testid=term-items-pagination')
  }

  async goto(term: string) {
    await super.goto(`membership/term/${term ?? ''}`)
  }

  async checkGridItems(
    tag:
      | Awaited<ReturnType<typeof getCategoryById>>
      | Awaited<ReturnType<typeof getTagById>>
  ) {
    tag?.posts?.nodes?.map(async post => {
      await expect(
        this.page.locator(`data-testid=post-grid-item-${post?.id}`)
      ).toBeVisible()
    })
  }

  async checkPagination(length: number) {
    if (length && length > PER_PAGE) {
      await expect(this.pagination).toBeVisible()
    }
  }
}
