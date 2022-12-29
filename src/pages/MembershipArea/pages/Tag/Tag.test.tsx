import { format } from 'date-fns'
import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  OrderEnum,
  TagQuery,
  TagQueryVariables,
  WpPageInfo,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities, buildPost, buildTag } from '@test/mock-data-utils'

import Tag, { PER_PAGE } from '.'

describe('page: Tag', () => {
  it('displays skeleton loading while fetching tag', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/blog/tag/tag-id']}>
          <Routes>
            <Route path="/blog/tag/:id" element={<Tag />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('posts-items-grid-skeleton')).toBeInTheDocument()
  })

  it('navigates to single blog post page when clicked on grid item image', () => {
    const posts = buildEntities(2, buildPost)
    const tag = buildTag()

    const client = {
      executeQuery: () =>
        fromValue<{ data: TagQuery }>({
          data: {
            content: {
              tag: {
                ...tag,
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
        <MemoryRouter initialEntries={[`/tag/${tag.id}`]}>
          <Routes>
            <Route path="tag/:id" element={<Tag />} />
            <Route path=":id" element={<p>Post page</p>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    const firstPost = screen.getByTestId(`post-grid-item-${posts[0].id}`)
    userEvent.click(within(firstPost).getByAltText(posts[0].title ?? ''))

    expect(screen.getByText('Post page')).toBeInTheDocument()
  })

  it('displays items in a grid', () => {
    const posts = buildEntities(10, buildPost)
    const tag = buildTag()

    const client = {
      executeQuery: () =>
        fromValue<{ data: TagQuery }>({
          data: {
            content: {
              tag: {
                ...tag,
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
        <MemoryRouter initialEntries={[`/tag/${tag.id}`]}>
          <Routes>
            <Route path="tag/:id" element={<Tag />} />
          </Routes>
        </MemoryRouter>
      </Provider>
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
    const tag = buildTag()

    const client = {
      executeQuery: ({ variables }: { variables: TagQueryVariables }) => {
        const items = variables.term === SEARCH_TERM ? [filteredItem] : posts

        return fromValue<{ data: TagQuery }>({
          data: {
            content: {
              tag: {
                ...tag,
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
        <MemoryRouter initialEntries={[`/tag/${tag.id}`]}>
          <Routes>
            <Route path="tag/:id" element={<Tag />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    userEvent.type(screen.getByPlaceholderText('Search posts'), SEARCH_TERM)

    await waitFor(() => {
      expect(
        screen.getByTestId(`post-grid-item-${filteredItem.id}`)
      ).toBeInTheDocument()
    })
  })

  it('sorts by published date', () => {
    const posts = buildEntities(20, buildPost)
    const reversedPosts = posts.slice().reverse()
    const tag = buildTag()

    const client = {
      executeQuery: ({ variables }: { variables: TagQueryVariables }) => {
        return fromValue<{ data: TagQuery }>({
          data: {
            content: {
              tag: {
                ...tag,
                posts: {
                  nodes:
                    variables.orderDirection === OrderEnum.Asc
                      ? reversedPosts.slice(0, PER_PAGE)
                      : posts.slice(0, PER_PAGE),
                },
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/tag/${tag.id}`]}>
          <Routes>
            <Route path="tag/:id" element={<Tag />} />
          </Routes>
        </MemoryRouter>
      </Provider>
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
    const tag = buildTag()

    const client = {
      executeQuery: ({ variables }: { variables: TagQueryVariables }) => {
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

        return fromValue<{ data: TagQuery }>({
          data: {
            content: {
              tag: {
                ...tag,
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
        <MemoryRouter initialEntries={[`/tag/${tag.id}`]}>
          <Routes>
            <Route path="tag/:id" element={<Tag />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    userEvent.click(screen.getByTestId('posts-next-page'))

    expect(
      screen.queryByTestId(`post-grid-item-${firstBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`post-grid-item-${secondBatch[0].id}`)
    ).toBeInTheDocument()

    expect(screen.getByTestId('posts-next-page')).toBeDisabled()

    userEvent.click(screen.getByTestId('posts-previous-page'))

    expect(
      screen.getByTestId(`post-grid-item-${firstBatch[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`post-grid-item-${secondBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(screen.getByTestId('posts-previous-page')).toBeDisabled()
  })
})
