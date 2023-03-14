import { test as base } from '@playwright/test'

import { getFirstTagIdWithPosts, getTagById } from '../../api/hasura-api'
import { stateFilePath } from '../../hooks/global-setup'
import { TermPage } from '../../pages/membership/TermPage'

const test = base.extend<{
  tag: Awaited<ReturnType<typeof getTagById>>
}>({
  tag: async ({}, use) => {
    const tagId = await getFirstTagIdWithPosts()
    const tag = await getTagById(tagId ?? '')

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
