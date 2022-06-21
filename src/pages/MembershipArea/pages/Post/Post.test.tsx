import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import { PostQuery } from '@app/generated/graphql'

import { render, screen, userEvent, waitForText, within } from '@test/index'
import { buildEntities, buildPost } from '@test/mock-data-utils'

import Post from '.'

describe('page: Post', () => {
  it('displays skeleton while fetching data', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/blog/post-id']}>
          <Routes>
            <Route path="blog/:id" element={<Post />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('back-nav-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('title-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('description-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('image-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('recent-posts-skeleton')).toBeInTheDocument()
  })

  it('navigates back to the blog page', async () => {
    const post = buildPost()

    const client = {
      executeQuery: () =>
        fromValue<{ data: PostQuery }>({
          data: {
            content: {
              post,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/${post.id}`]}>
          <Routes>
            <Route index element={<p>Blog page</p>} />
            <Route path=":id" element={<Post />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    userEvent.click(screen.getByText('Blog'))

    await waitForText('Blog page')
  })

  it('displays an error if there is no post', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: PostQuery }>({
          data: {
            content: {
              post: null,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/blog/not-found`]}>
          <Routes>
            <Route path="blog/:id" element={<Post />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Post not found')).toBeInTheDocument()
  })

  it('displays post details', () => {
    const post = {
      ...buildPost(),
      author: {
        node: {
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    }

    const client = {
      executeQuery: () =>
        fromValue<{ data: PostQuery }>({
          data: {
            content: {
              post,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/blog/${post.id}`]}>
          <Routes>
            <Route path="blog/:id" element={<Post />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('post-title')).toHaveTextContent(post.title ?? '')
    expect(screen.getByTestId('post-description')).toHaveTextContent(
      post.excerpt ?? ''
    )
    expect(screen.getByText('by John Doe')).toBeInTheDocument()

    post.tags?.nodes?.forEach(tag => {
      expect(screen.getByText(tag?.name ?? '')).toBeInTheDocument()
    })

    expect(screen.getByAltText(post.title ?? '')).toHaveAttribute(
      'src',
      post.featuredImage?.node?.mediaItemUrl ?? ''
    )
  })

  it('displays recent posts', () => {
    const recentPosts = buildEntities(4, buildPost)
    const post = buildPost()

    const client = {
      executeQuery: () =>
        fromValue<{ data: PostQuery }>({
          data: {
            content: {
              post,
              recentPosts: {
                nodes: recentPosts,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/blog/${post.id}`]}>
          <Routes>
            <Route path="blog/:id" element={<Post />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    recentPosts.forEach(post => {
      const recentPostEl = screen.getByTestId(`posts-grid-item-${post.id}`)

      expect(
        within(recentPostEl).getByText(post.title ?? '')
      ).toBeInTheDocument()

      expect(
        within(recentPostEl).getByAltText(post.title ?? '')
      ).toHaveAttribute('src', post.featuredImage?.node?.mediaItemUrl ?? '')
    })
  })
})
