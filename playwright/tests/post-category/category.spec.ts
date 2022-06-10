/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import {
  getFirstCategoryIdWithPosts,
  getCategoryById,
} from '../../api/hasura-api'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const PER_PAGE = 12

const test = base.extend<{
  category: Awaited<ReturnType<typeof getCategoryById>>
}>({
  category: async ({}, use) => {
    const categoryId = await getFirstCategoryIdWithPosts()
    const category = await getCategoryById(categoryId ?? '')

    await use(category)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays category title and posts that belong to the category', async ({
  page,
  category,
}) => {
  await page.goto(`${BASE_URL}/membership/blog/category/${category?.id}`)
  await page.waitForLoadState('networkidle')

  category?.posts?.nodes?.map(post => {
    test
      .expect(page.locator(`data-testid=post-grid-item-${post?.id}`))
      .toBeVisible()
  })

  if (
    category?.posts?.nodes?.length &&
    category.posts.nodes.length > PER_PAGE
  ) {
    test.expect(page.locator('data-testid=posts-pagination')).toBeVisible()
  }
})
