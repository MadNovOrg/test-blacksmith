import { format } from 'date-fns'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  BlogQuery,
  BlogQueryVariables,
  OrderEnum,
  WpPageInfo,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities, buildPost } from '@test/mock-data-utils'

import Blog, { PER_PAGE } from '.'

describe('page: Blog', () => {
  it('displays skeleton loading while fetching posts', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/blog'] }
    )

    expect(screen.getByTestId('featured-post-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('posts-items-grid-skeleton')).toBeInTheDocument()
  })

  it('displays no results found text if there are no search results', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: BlogQuery }>({
          data: {
            content: {
              posts: {
                nodes: [],
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/blog'] }
    )

    expect(screen.getByText('No results found.')).toBeInTheDocument()
  })

  it('displays first post as a featured one', () => {
    const posts = buildEntities(2, buildPost)

    const client = {
      executeQuery: () =>
        fromValue<{ data: BlogQuery }>({
          data: {
            content: {
              posts: {
                nodes: posts,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/blog'] }
    )

    expect(
      screen.queryByTestId('featured-post-skeleton')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('post-items-grid-skeleton')
    ).not.toBeInTheDocument()

    const featuredPost = screen.getByTestId('featured-post-item')

    expect(
      within(featuredPost).getByText(posts[0].title ?? '')
    ).toBeInTheDocument()

    expect(within(featuredPost).getByText('New post')).toBeInTheDocument()

    expect(
      within(featuredPost).getByAltText(posts[0].title ?? '')
    ).toHaveAttribute('src', posts[0].featuredImage?.node?.mediaItemUrl ?? '')
  })

  it('navigates to single blog post page when clicked on featured image', () => {
    const posts = buildEntities(2, buildPost)

    const client = {
      executeQuery: () =>
        fromValue<{ data: BlogQuery }>({
          data: {
            content: {
              posts: {
                nodes: posts,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<p>Post page</p>} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/blog'] }
    )

    const featuredPost = screen.getByTestId('featured-post-item')

    userEvent.click(within(featuredPost).getByAltText(posts[0].title ?? ''))

    expect(screen.getByText('Post page')).toBeInTheDocument()
  })

  it('displays items in a grid', () => {
    const posts = buildEntities(10, buildPost)

    const client = {
      executeQuery: () =>
        fromValue<{ data: BlogQuery }>({
          data: {
            content: {
              posts: {
                nodes: posts,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/blog'] }
    )

    posts.forEach(item => {
      const itemElement = screen.getByTestId(`post-grid-item-${item.id}`)

      expect(
        within(itemElement).getByText(item.title ?? '')
      ).toBeInTheDocument()
      expect(
        within(itemElement).getByAltText(item.title ?? '')
      ).toHaveAttribute('src', item.featuredImage?.node?.mediaItemUrl ?? '')

      expect(
        within(itemElement).getByText(
          format(new Date(item.date ?? ''), 'd MMMM yyyy')
        )
      ).toBeInTheDocument()
    })
  })

  it('searches for a post', async () => {
    const posts = buildEntities(10, buildPost)
    const filteredItem = buildPost()
    const SEARCH_TERM = 'search term'

    const client = {
      executeQuery: ({ variables }: { variables: BlogQueryVariables }) => {
        const items = variables.term === SEARCH_TERM ? [filteredItem] : posts

        return fromValue<{ data: BlogQuery }>({
          data: {
            content: {
              posts: {
                nodes: items,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/blog'] }
    )

    userEvent.type(screen.getByPlaceholderText('Search posts'), SEARCH_TERM)

    await waitFor(() => {
      expect(
        screen.getByTestId(`post-grid-item-${filteredItem.id}`)
      ).toBeInTheDocument()
    })
  })

  it('displays pagination if there is more content', () => {
    const posts = buildEntities(10, buildPost)

    const client = {
      executeQuery: () =>
        fromValue<{ data: BlogQuery }>({
          data: {
            content: {
              posts: {
                pageInfo: {
                  hasNextPage: true,
                  hasPreviousPage: false,
                },
                nodes: posts,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/blog'] }
    )

    expect(screen.getByTestId('posts-pagination')).toBeInTheDocument()
  })

  it('sorts by published date', () => {
    const posts = buildEntities(20, buildPost)
    const reversedPosts = posts.slice().reverse()

    const client = {
      executeQuery: ({ variables }: { variables: BlogQueryVariables }) => {
        return fromValue<{ data: BlogQuery }>({
          data: {
            content: {
              posts: {
                nodes:
                  variables.orderDirection === OrderEnum.Asc
                    ? reversedPosts.slice(0, PER_PAGE)
                    : posts.slice(0, PER_PAGE),
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/blog'] }
    )

    expect(
      screen.getByTestId(`post-grid-item-${posts[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`post-grid-item-${reversedPosts[0].id}`)
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByTestId('order-menu-button'))
    userEvent.click(screen.getByText('Oldest'))

    expect(
      screen.queryByTestId(`post-grid-item-${posts[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`post-grid-item-${reversedPosts[0].id}`)
    ).toBeInTheDocument()
  })

  it('paginates blog posts', async () => {
    const firstBatch = buildEntities(13, buildPost)
    const secondBatch = buildEntities(12, buildPost)

    const client = {
      executeQuery: ({ variables }: { variables: BlogQueryVariables }) => {
        const posts = variables.after ? secondBatch : firstBatch
        const pageInfo: WpPageInfo = {
          ...(variables.after
            ? {
                hasNextPage: false,
                hasPreviousPage: true,
                startCursor: 'start-cursor',
                endCursor: null,
              }
            : {
                hasNextPage: true,
                hasPreviousPage: false,
                startCursor: null,
                endCursor: 'end-cursor',
              }),
        }

        return fromValue<{ data: BlogQuery }>({
          data: {
            content: {
              posts: {
                pageInfo,
                nodes: posts,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/blog'] }
    )

    userEvent.click(screen.getByTestId('posts-next-page'))

    expect(
      within(screen.getByTestId('featured-post-item')).getByText(
        firstBatch[0].title ?? ''
      )
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`post-grid-item-${firstBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`post-grid-item-${secondBatch[0].id}`)
    ).toBeInTheDocument()

    expect(screen.getByTestId('posts-next-page')).toBeDisabled()

    userEvent.click(screen.getByTestId('posts-previous-page'))

    expect(
      within(screen.getByTestId('featured-post-item')).getByText(
        firstBatch[0].title ?? ''
      )
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(`post-grid-item-${firstBatch[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`post-grid-item-${secondBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(screen.getByTestId('posts-previous-page')).toBeDisabled()
  })
})
