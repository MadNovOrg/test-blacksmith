import { expect, Locator, Page } from '@playwright/test'

import { PostSummaryFragment } from '@app/generated/graphql'

import { PER_PAGE } from '@qa/constants'

import { BasePage } from '../BasePage.fixture'

export class BlogPage extends BasePage {
  readonly featuredImage: Locator
  readonly pagination: Locator

  constructor(page: Page) {
    super(page)
    this.featuredImage = this.page.locator(
      'data-testid=featured-post-item >> img'
    )
    this.pagination = this.page.locator('data-testid=posts-pagination')
  }

  async goto(id?: string) {
    await super.goto(`membership/blog/${id ?? ''}`)
  }

  async checkFeaturedImage(source: string) {
    await expect(this.featuredImage).toHaveAttribute('src', source)
  }

  async checkFeaturedTitle(title: string) {
    await expect(
      this.page.locator(`data-testid=featured-post-item >> text="${title}"`)
    ).toBeVisible()
  }

  async checkPostTitle(title: string) {
    await expect(this.page.locator(`data-testid=post-title`)).toHaveText(title)
  }

  async checkGridItem(id: string) {
    await expect(
      this.page.locator(`data-testid=post-grid-item-${id}`)
    ).toBeVisible()
  }

  async checkPagination(length: number) {
    if (length > PER_PAGE) {
      await expect(this.pagination).toBeVisible()
    }
  }

  async checkRecent(recentItems: (PostSummaryFragment | null)[]) {
    const filteredItems = recentItems.filter(item => item !== null)
    await Promise.all(
      filteredItems.map(async recentItem => {
        await expect(
          this.page.locator(`data-testid=posts-grid-item-${recentItem?.id}`)
        ).toBeVisible()
      })
    )
  }
}
