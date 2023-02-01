import { format } from 'date-fns'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  OrderEnum,
  TermQuery,
  TermQueryVariables,
  WpPageInfo,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities, buildWebinar } from '@test/mock-data-utils'

import Term, { PER_PAGE } from '.'

describe('page: Term - WebinarsCategory', () => {
  it('displays skeleton loading while fetching webinars category', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/term/:id" element={<Term />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/term/tag-id'] }
    )

    expect(screen.getByTestId('items-grid-skeleton')).toBeInTheDocument()
  })

  it('navigates to single webinar page when clicked on grid item image', () => {
    const webinars = buildEntities(2, buildWebinar)
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
                __typename: 'WebinarsCategory',
                ...category,
                webinars: {
                  nodes: webinars,
                },
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="term/:id" element={<Term />} />
          <Route path="webinars/:id" element={<p>Webinar page</p>} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/term/${category.id}`] }
    )

    const firstPost = screen.getByTestId(`webinar-grid-item-${webinars[0].id}`)
    userEvent.click(within(firstPost).getByAltText(webinars[0].title ?? ''))

    expect(screen.getByText('Webinar page')).toBeInTheDocument()
  })

  it('displays items in a grid', () => {
    const webinars = buildEntities(10, buildWebinar)
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
                __typename: 'WebinarsCategory',
                ...category,
                webinars: {
                  nodes: webinars,
                },
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="term/:id" element={<Term />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/term/${category.id}`] }
    )

    webinars.forEach(item => {
      const itemElement = screen.getByTestId(`webinar-grid-item-${item.id}`)

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

  it('searches for a webinar', async () => {
    const webinars = buildEntities(10, buildWebinar)
    const filteredItem = buildWebinar()
    const SEARCH_TERM = 'search term'
    const category = {
      id: 'category-id',
      name: 'Sample category',
    }

    const client = {
      executeQuery: ({ variables }: { variables: TermQueryVariables }) => {
        const items = variables.term === SEARCH_TERM ? [filteredItem] : webinars

        return fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'WebinarsCategory',
                ...category,
                webinars: {
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
          <Route path="term/:id" element={<Term />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/term/${category.id}`] }
    )

    userEvent.type(screen.getByPlaceholderText('Search webinars'), SEARCH_TERM)

    await waitFor(() => {
      expect(
        screen.getByTestId(`webinar-grid-item-${filteredItem.id}`)
      ).toBeInTheDocument()
    })
  })

  it('sorts by published date', () => {
    const webinars = buildEntities(20, buildWebinar)
    const reversedWebinars = webinars.slice().reverse()
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
                __typename: 'WebinarsCategory',
                ...category,
                webinars: {
                  nodes:
                    variables.orderDirection === OrderEnum.Asc
                      ? reversedWebinars.slice(0, PER_PAGE)
                      : webinars.slice(0, PER_PAGE),
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
          <Route path="term/:id" element={<Term />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/term/${category.id}`] }
    )

    expect(
      screen.getByTestId(`webinar-grid-item-${webinars[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`webinar-grid-item-${reversedWebinars[0].id}`)
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByTestId('order-menu-button'))
    userEvent.click(screen.getByText('Oldest'))

    expect(
      screen.queryByTestId(`webinar-grid-item-${webinars[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`webinar-grid-item-${reversedWebinars[0].id}`)
    ).toBeInTheDocument()
  })

  it('paginates blog posts', async () => {
    const firstBatch = buildEntities(13, buildWebinar)
    const secondBatch = buildEntities(12, buildWebinar)
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
                __typename: 'WebinarsCategory',
                ...category,
                webinars: {
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
        <Routes>
          <Route path="term/:id" element={<Term />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/term/${category.id}`] }
    )

    userEvent.click(screen.getByTestId('term-next-page'))

    expect(
      screen.queryByTestId(`webinar-grid-item-${firstBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`webinar-grid-item-${secondBatch[0].id}`)
    ).toBeInTheDocument()

    expect(screen.getByTestId('term-next-page')).toBeDisabled()

    userEvent.click(screen.getByTestId('term-previous-page'))

    expect(
      screen.getByTestId(`webinar-grid-item-${firstBatch[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`webinar-grid-item-${secondBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(screen.getByTestId('term-previous-page')).toBeDisabled()
  })
})
