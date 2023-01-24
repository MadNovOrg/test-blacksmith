/* eslint-disable no-empty-pattern */
import { test as base } from '@playwright/test'

import { PostSummaryFragment } from '@app/generated/graphql'

import { getBlogPosts, getPostById } from '../../api/hasura-api'
import { waitForPageLoad } from '../../commands'
import { BASE_URL } from '../../constants'
import { stateFilePath } from '../../hooks/global-setup'

const test = base.extend<{
  data: {
    post: PostSummaryFragment | null
    recentPosts: (PostSummaryFragment | null)[]
  }
}>({
  data: async ({}, use) => {
    const recentPosts = await getBlogPosts(4)
    const post = await getPostById(recentPosts[0]?.id ?? '')

    await use({ post, recentPosts })
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays video item details and recent items', async ({ page, data }) => {
  if (!data.post) {
    return test.fail()
  }

  await page.goto(`${BASE_URL}/membership/blog/${data.post.id}`)
  await waitForPageLoad(page)

  await test
    .expect(page.locator(`data-testid=post-title`))
    .toHaveText(data.post.title ?? '')

  data.recentPosts.map(async recentPost => {
    if (!recentPost) {
      return
    }

    await test
      .expect(page.locator(`data-testid=posts-grid-item-${recentPost.id}`))
      .toBeVisible()
  })
})
