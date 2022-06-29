import { format } from 'date-fns'
import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  OrderEnum,
  TermQuery,
  TermQueryVariables,
  WpPageInfo,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities, buildVideoItem } from '@test/mock-data-utils'

import Term, { PER_PAGE } from '.'

describe('page: Term - WebinarsCategory', () => {
  it('displays skeleton loading while fetching video series category', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/term/category-id']}>
          <Routes>
            <Route path="/term/:id" element={<Term />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('items-grid-skeleton')).toBeInTheDocument()
  })

  it('navigates to single video item page when clicked on grid item image', () => {
    const videoItems = buildEntities(2, buildVideoItem)
    const category = {
      id: 'category-id',
      name: 'Sample category',
    }

    const client = {
      executeQuery: () =>
        fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'VideoSeriesCategory',
                ...category,
                videoSeriesItems: {
                  nodes: videoItems,
                },
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/term/${category.id}`]}>
          <Routes>
            <Route path="term/:id" element={<Term />} />
            <Route path="video-series/:id" element={<p>Video page</p>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    const firstPost = screen.getByTestId(
      `video-series-grid-item-${videoItems[0].id}`
    )
    userEvent.click(within(firstPost).getByAltText(videoItems[0].title ?? ''))

    expect(screen.getByText('Video page'))
  })

  it('displays items in a grid', () => {
    const videoItems = buildEntities(10, buildVideoItem)
    const category = {
      id: 'category-id',
      name: 'Sample category',
    }

    const client = {
      executeQuery: () =>
        fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'VideoSeriesCategory',
                ...category,
                videoSeriesItems: {
                  nodes: videoItems,
                },
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/term/${category.id}`]}>
          <Routes>
            <Route path="term/:id" element={<Term />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    videoItems.forEach(item => {
      const itemElement = screen.getByTestId(
        `video-series-grid-item-${item.id}`
      )

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

  it('searches for a video item', async () => {
    const videoItems = buildEntities(10, buildVideoItem)
    const filteredItem = buildVideoItem()
    const SEARCH_TERM = 'search term'
    const category = {
      id: 'category-id',
      name: 'Sample category',
    }

    const client = {
      executeQuery: ({ variables }: { variables: TermQueryVariables }) => {
        const items =
          variables.term === SEARCH_TERM ? [filteredItem] : videoItems

        return fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'VideoSeriesCategory',
                ...category,
                videoSeriesItems: {
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
        <MemoryRouter initialEntries={[`/term/${category.id}`]}>
          <Routes>
            <Route path="term/:id" element={<Term />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    userEvent.type(screen.getByPlaceholderText('Search videos'), SEARCH_TERM)

    await waitFor(() => {
      expect(
        screen.getByTestId(`video-series-grid-item-${filteredItem.id}`)
      ).toBeInTheDocument()
    })
  })

  it('sorts by published date', () => {
    const videoItems = buildEntities(20, buildVideoItem)
    const reversedVideoItems = videoItems.slice().reverse()
    const category = {
      id: 'category-id',
      name: 'Sample category',
    }

    const client = {
      executeQuery: ({ variables }: { variables: TermQueryVariables }) => {
        return fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'VideoSeriesCategory',
                ...category,
                videoSeriesItems: {
                  nodes:
                    variables.orderDirection === OrderEnum.Asc
                      ? reversedVideoItems.slice(0, PER_PAGE)
                      : videoItems.slice(0, PER_PAGE),
                },
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/term/${category.id}`]}>
          <Routes>
            <Route path="term/:id" element={<Term />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(
      screen.getByTestId(`video-series-grid-item-${videoItems[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`video-series-grid-item-${reversedVideoItems[0].id}`)
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByTestId('order-menu-button'))
    userEvent.click(screen.getByText('Oldest'))

    expect(
      screen.queryByTestId(`video-series-grid-item-${videoItems[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`video-series-grid-item-${reversedVideoItems[0].id}`)
    ).toBeInTheDocument()
  })

  it('paginates video items', async () => {
    const firstBatch = buildEntities(13, buildVideoItem)
    const secondBatch = buildEntities(12, buildVideoItem)
    const category = {
      id: 'category-id',
      name: 'Sample category',
    }

    const client = {
      executeQuery: ({ variables }: { variables: TermQueryVariables }) => {
        const webinars = variables.after ? secondBatch : firstBatch
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

        return fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'VideoSeriesCategory',
                ...category,
                videoSeriesItems: {
                  pageInfo,
                  nodes: webinars,
                },
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/term/${category.id}`]}>
          <Routes>
            <Route path="term/:id" element={<Term />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    userEvent.click(screen.getByTestId('term-next-page'))

    expect(
      screen.queryByTestId(`video-series-grid-item-${firstBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`video-series-grid-item-${secondBatch[0].id}`)
    ).toBeInTheDocument()

    expect(screen.getByTestId('term-next-page')).toBeDisabled()

    userEvent.click(screen.getByTestId('term-previous-page'))

    expect(
      screen.getByTestId(`video-series-grid-item-${firstBatch[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`video-series-grid-item-${secondBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(screen.getByTestId('term-previous-page')).toBeDisabled()
  })
})
