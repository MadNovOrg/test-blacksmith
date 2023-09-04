import { test as base } from '@playwright/test'

import { PostSummaryFragment } from '@app/generated/graphql'

import * as API from '@qa/api'
import { BlogPage } from '@qa/fixtures/pages/membership/BlogPage.fixture'
import { stateFilePath } from '@qa/util'

const test = base.extend<{
  data: {
    post: PostSummaryFragment | null
    recentPosts: (PostSummaryFragment | null)[]
  }
}>({
  data: async ({}, use) => {
    const recentPosts = await API.post.getBlogPosts(4)
    const post = await API.post.getPostById(recentPosts[0]?.id ?? '')
    await use({ post, recentPosts })
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays video item details and recent items', async ({ page, data }) => {
  // eslint-disable-next-line playwright/no-conditional-in-test
  if (!data.post) {
    return test.fail()
  }
  const blogPage = new BlogPage(page)
  await blogPage.goto(data.post.id || '')
  await blogPage.checkPostTitle(data.post.title ?? '')
  await blogPage.checkRecent(data.recentPosts || [])
})
