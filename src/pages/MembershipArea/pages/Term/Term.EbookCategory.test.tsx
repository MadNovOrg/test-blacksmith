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
import { DEFAULT_PAGINATION_LIMIT } from '@app/util'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEbook, buildEntities } from '@test/mock-data-utils'

import Term from '.'

describe('page: Term - EbookCategory', () => {
  it('displays skeleton loading while fetching ebook category', () => {
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
      { initialEntries: ['/term/ebook-category-id'] }
    )

    expect(screen.getByTestId('items-grid-skeleton')).toBeInTheDocument()
  })

  it('displays items in a grid', () => {
    const ebooks = buildEntities(10, buildEbook)
    const category = {
      id: 'ebook-category-id',
      name: 'Same category',
    }

    const client = {
      executeQuery: () =>
        fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'EbooksCategory',
                ...category,
                ebooks: {
                  nodes: ebooks,
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

    ebooks.forEach(item => {
      const itemElement = screen.getByTestId(`ebook-grid-item-${item.id}`)

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

  it('searches for an ebook', async () => {
    const ebooks = buildEntities(10, buildEbook)
    const filteredItem = buildEbook()
    const SEARCH_TERM = 'search term'
    const category = {
      id: 'ebook-category-id',
      name: 'Same category',
    }

    const client = {
      executeQuery: ({ variables }: { variables: TermQueryVariables }) => {
        const items = variables.term === SEARCH_TERM ? [filteredItem] : ebooks

        return fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'EbooksCategory',
                ...category,
                ebooks: {
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

    await userEvent.type(
      screen.getByPlaceholderText('Search ebooks'),
      SEARCH_TERM
    )

    await waitFor(() => {
      expect(
        screen.getByTestId(`ebook-grid-item-${filteredItem.id}`)
      ).toBeInTheDocument()
    })
  })

  it('sorts by published date', async () => {
    const ebooks = buildEntities(20, buildEbook)
    const ebooksPosts = ebooks.slice().reverse()
    const category = {
      id: 'ebook-category-id',
      name: 'Same category',
    }

    const client = {
      executeQuery: ({ variables }: { variables: TermQueryVariables }) => {
        return fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'EbooksCategory',
                ...category,
                ebooks: {
                  nodes:
                    variables.orderDirection === OrderEnum.Asc
                      ? ebooksPosts.slice(0, DEFAULT_PAGINATION_LIMIT)
                      : ebooks.slice(0, DEFAULT_PAGINATION_LIMIT),
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
      screen.getByTestId(`ebook-grid-item-${ebooks[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`ebook-grid-item-${ebooksPosts[0].id}`)
    ).not.toBeInTheDocument()

    await userEvent.click(screen.getByTestId('order-menu-button'))
    await userEvent.click(screen.getByText('Oldest'))

    expect(
      screen.queryByTestId(`ebook-grid-item-${ebooks[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`ebook-grid-item-${ebooksPosts[0].id}`)
    ).toBeInTheDocument()
  })

  it('paginates ebooks', async () => {
    const firstBatch = buildEntities(13, buildEbook)
    const secondBatch = buildEntities(12, buildEbook)
    const category = {
      id: 'ebook-category-id',
      name: 'Same category',
    }

    const client = {
      executeQuery: ({ variables }: { variables: TermQueryVariables }) => {
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

        return fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'EbooksCategory',
                ...category,
                ebooks: {
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
          <Route path="term/:id" element={<Term />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/term/${category.id}`] }
    )

    await userEvent.click(screen.getByTestId('term-next-page'))

    expect(
      screen.queryByTestId(`ebook-grid-item-${firstBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`ebook-grid-item-${secondBatch[0].id}`)
    ).toBeInTheDocument()

    expect(screen.getByTestId('term-next-page')).toBeDisabled()

    await userEvent.click(screen.getByTestId('term-previous-page'))

    expect(
      screen.getByTestId(`ebook-grid-item-${firstBatch[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`ebook-grid-item-${secondBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(screen.getByTestId('term-previous-page')).toBeDisabled()
  })
})
