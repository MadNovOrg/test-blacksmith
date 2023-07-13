import { format } from 'date-fns'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  CategoryQuery,
  CategoryQueryVariables,
  OrderEnum,
  WpPageInfo,
} from '@app/generated/graphql'
import { DEFAULT_PAGINATION_LIMIT } from '@app/util'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildCategory, buildEntities, buildPost } from '@test/mock-data-utils'

import Category from '.'

describe('page: Category', () => {
  it('displays skeleton loading while fetching category', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/blog/category/:id" element={<Category />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/blog/category/category-id'] }
    )

    expect(screen.getByTestId('posts-items-grid-skeleton')).toBeInTheDocument()
  })

  it('navigates to single blog post page when clicked on grid item image', async () => {
    const posts = buildEntities(2, buildPost)
    const category = buildCategory()

    const client = {
      executeQuery: () =>
        fromValue<{ data: CategoryQuery }>({
          data: {
            content: {
              category: {
                ...category,
                posts: {
                  nodes: posts,
                },
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="category/:id" element={<Category />} />
          <Route path=":id" element={<p>Post page</p>} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/category/${category.id}`] }
    )

    const firstPost = screen.getByTestId(`post-grid-item-${posts[0].id}`)
    await userEvent.click(within(firstPost).getByAltText(posts[0].title ?? ''))

    expect(screen.getByText('Post page')).toBeInTheDocument()
  })

  it('displays items in a grid', () => {
    const posts = buildEntities(10, buildPost)
    const category = buildCategory()

    const client = {
      executeQuery: () =>
        fromValue<{ data: CategoryQuery }>({
          data: {
            content: {
              category: {
                ...category,
                posts: {
                  nodes: posts,
                },
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="category/:id" element={<Category />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/category/${category.id}`] }
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
    const category = buildCategory()

    const client = {
      executeQuery: ({ variables }: { variables: CategoryQueryVariables }) => {
        const items = variables.term === SEARCH_TERM ? [filteredItem] : posts

        return fromValue<{ data: CategoryQuery }>({
          data: {
            content: {
              category: {
                ...category,
                posts: {
                  nodes: items,
                },
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="category/:id" element={<Category />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/category/${category.id}`] }
    )

    await userEvent.type(
      screen.getByPlaceholderText('Search posts'),
      SEARCH_TERM
    )

    await waitFor(() => {
      expect(
        screen.getByTestId(`post-grid-item-${filteredItem.id}`)
      ).toBeInTheDocument()
    })
  })

  it('sorts by published date', async () => {
    const posts = buildEntities(20, buildPost)
    const reversedPosts = posts.slice().reverse()
    const category = buildCategory()

    const client = {
      executeQuery: ({ variables }: { variables: CategoryQueryVariables }) => {
        return fromValue<{ data: CategoryQuery }>({
          data: {
            content: {
              category: {
                ...category,
                posts: {
                  nodes:
                    variables.orderDirection === OrderEnum.Asc
                      ? reversedPosts.slice(0, DEFAULT_PAGINATION_LIMIT)
                      : posts.slice(0, DEFAULT_PAGINATION_LIMIT),
                },
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="category/:id" element={<Category />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/category/${category.id}`] }
    )

    expect(
      screen.getByTestId(`post-grid-item-${posts[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`post-grid-item-${reversedPosts[0].id}`)
    ).not.toBeInTheDocument()

    await userEvent.click(screen.getByTestId('order-menu-button'))
    await userEvent.click(screen.getByText('Oldest'))

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
    const category = buildCategory()

    const client = {
      executeQuery: ({ variables }: { variables: CategoryQueryVariables }) => {
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

        return fromValue<{ data: CategoryQuery }>({
          data: {
            content: {
              category: {
                ...category,
                posts: {
                  pageInfo,
                  nodes: posts,
                },
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="category/:id" element={<Category />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/category/${category.id}`] }
    )

    await userEvent.click(screen.getByTestId('posts-next-page'))

    expect(
      screen.queryByTestId(`post-grid-item-${firstBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`post-grid-item-${secondBatch[0].id}`)
    ).toBeInTheDocument()

    expect(screen.getByTestId('posts-next-page')).toBeDisabled()

    await userEvent.click(screen.getByTestId('posts-previous-page'))

    expect(
      screen.getByTestId(`post-grid-item-${firstBatch[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`post-grid-item-${secondBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(screen.getByTestId('posts-previous-page')).toBeDisabled()
  })
})
