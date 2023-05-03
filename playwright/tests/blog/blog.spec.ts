import { test as base } from '@playwright/test'

import { PostSummaryFragment } from '@app/generated/graphql'

import * as API from '../../api'
import { stateFilePath } from '../../hooks/global-setup'
import { BlogPage } from '../../pages/membership/BlogPage'

const test = base.extend<{
  posts: (PostSummaryFragment | null)[]
}>({
  posts: async ({}, use) => {
    const posts = await API.post.getBlogPosts()

    await use(posts)
  },
})

test.use({ storageState: stateFilePath('trainer') })

test('displays posts with featured and grid display', async ({
  page,
  posts,
}) => {
  const blogPage = new BlogPage(page)
  await blogPage.goto()
  await blogPage.checkFeaturedImage(
    posts[0]?.featuredImage?.node?.mediaItemUrl ?? ''
  )
  await blogPage.checkFeaturedTitle(posts[0]?.title ?? '')
  await blogPage.checkGridItem(posts[1]?.id ?? '')
  await blogPage.checkPagination(posts.length)
})
