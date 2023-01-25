/* eslint-disable no-empty-pattern */
import { expect, test as base } from '@playwright/test'

import {
  getFirstCategoryIdWithPosts,
  getCategoryById,
} from '../../api/hasura-api'
import { waitForPageLoad } from '../../commands'
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
  await page.goto(`${BASE_URL}/membership/term/${category?.id}`)
  await waitForPageLoad(page)

  category?.posts?.nodes?.map(async post => {
    await expect(
      page.locator(`data-testid=post-grid-item-${post?.id}`)
    ).toBeVisible()
  })

  // eslint-disable-next-line playwright/no-conditional-in-test
  if (
    // eslint-disable-next-line playwright/no-conditional-in-test
    category?.posts?.nodes?.length &&
    category.posts.nodes.length > PER_PAGE
  ) {
    await expect(
      page.locator('data-testid=term-items-pagination')
    ).toBeVisible()
  }
})
