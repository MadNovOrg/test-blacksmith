import { test as base } from '@playwright/test'

import * as API from '@qa/api'
import { stateFilePath } from '@qa/hooks/global-setup'
import { TermPage } from '@qa/pages/membership/TermPage'

const test = base.extend<{
  tag: Awaited<ReturnType<typeof API.post.getTagById>>
}>({
  tag: async ({}, use) => {
    const tagId = await API.post.getFirstTagIdWithPosts()
    const tag = await API.post.getTagById(tagId ?? '')

    await use(tag)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays tag title and posts that belong to the tag', async ({
  page,
  tag,
}) => {
  const termPage = new TermPage(page)
  await termPage.goto(tag?.id ?? '')
  await termPage.checkGridItems(tag)
  await termPage.checkPagination(tag?.posts?.nodes?.length ?? 0)
})
