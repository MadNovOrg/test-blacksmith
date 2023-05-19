import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { stateFilePath } from '@qa/hooks/global-setup'
import { TermPage } from '@qa/pages/membership/TermPage'

const test = base.extend<{
  category: Awaited<ReturnType<typeof API.post.getCategoryById>>
}>({
  category: async ({}, use) => {
    const categoryId = await API.post.getFirstCategoryIdWithPosts()
    const category = await API.post.getCategoryById(categoryId ?? '')

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
