import { test as base } from '@playwright/test'

import {
  getFirstCategoryIdWithPosts,
  getCategoryById,
} from '../../api/hasura-api'
import { stateFilePath } from '../../hooks/global-setup'
import { TermPage } from '../../pages/membership/TermPage'

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
  const termPage = new TermPage(page)
  await termPage.goto(category?.id ?? '')
  await termPage.checkGridItems(category)
  await termPage.checkPagination(category?.posts?.nodes?.length ?? 0)
})
