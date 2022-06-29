/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { getFirstTagIdWithPosts, getTagById } from '../../api/hasura-api'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const PER_PAGE = 12

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
  await page.goto(`${BASE_URL}/membership/term/${tag?.id}`)
  await page.waitForLoadState('networkidle')

  tag?.posts?.nodes?.map(post => {
    test
      .expect(page.locator(`data-testid=post-grid-item-${post?.id}`))
      .toBeVisible()
  })

  if (tag?.posts?.nodes?.length && tag.posts.nodes.length > PER_PAGE) {
    test.expect(page.locator('data-testid=term-items-pagination')).toBeVisible()
  }
})
