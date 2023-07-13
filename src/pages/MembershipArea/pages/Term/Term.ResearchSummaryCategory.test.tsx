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
import { buildEntities, buildResearchSummary } from '@test/mock-data-utils'

import Term from '.'

describe('page: Term - ResearchSummaryCategory', () => {
  it('displays skeleton loading while fetching research summaries category', () => {
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
      { initialEntries: ['/term/research-summaries-category-id'] }
    )

    expect(screen.getByTestId('items-grid-skeleton')).toBeInTheDocument()
  })

  it('displays items in a grid', () => {
    const researchSummaries = buildEntities(10, buildResearchSummary)
    const category = {
      id: 'research-summaries-category-id',
      name: 'Same category',
    }

    const client = {
      executeQuery: () =>
        fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'ResearchSummariesCategory',
                ...category,
                researchSummaries: {
                  nodes: researchSummaries,
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

    researchSummaries.forEach(item => {
      const itemElement = screen.getByTestId(
        `research-summary-grid-item-${item.id}`
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

  it('searches for a research summary', async () => {
    const researchSummaries = buildEntities(10, buildResearchSummary)
    const filteredItem = buildResearchSummary()
    const SEARCH_TERM = 'search term'
    const category = {
      id: 'research-summaries-category-id',
      name: 'Sample category',
    }

    const client = {
      executeQuery: ({ variables }: { variables: TermQueryVariables }) => {
        const items =
          variables.term === SEARCH_TERM ? [filteredItem] : researchSummaries

        return fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'ResearchSummariesCategory',
                ...category,
                researchSummaries: {
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
      screen.getByPlaceholderText('Search summaries'),
      SEARCH_TERM
    )

    await waitFor(() => {
      expect(
        screen.getByTestId(`research-summary-grid-item-${filteredItem.id}`)
      ).toBeInTheDocument()
    })
  })

  it('sorts by published date', async () => {
    const researchSummaries = buildEntities(20, buildResearchSummary)
    const reversedResearchSummaries = researchSummaries.slice().reverse()
    const category = {
      id: 'research-summary-category-id',
      name: 'Sample category',
    }

    const client = {
      executeQuery: ({ variables }: { variables: TermQueryVariables }) => {
        return fromValue<{ data: TermQuery }>({
          data: {
            content: {
              termNode: {
                __typename: 'ResearchSummariesCategory',
                ...category,
                researchSummaries: {
                  nodes:
                    variables.orderDirection === OrderEnum.Asc
                      ? reversedResearchSummaries.slice(
                          0,
                          DEFAULT_PAGINATION_LIMIT
                        )
                      : researchSummaries.slice(0, DEFAULT_PAGINATION_LIMIT),
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
      screen.getByTestId(
        `research-summary-grid-item-${researchSummaries[0].id}`
      )
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(
        `research-summary-grid-item-${reversedResearchSummaries[0].id}`
      )
    ).not.toBeInTheDocument()

    await userEvent.click(screen.getByTestId('order-menu-button'))
    await userEvent.click(screen.getByText('Oldest'))

    expect(
      screen.queryByTestId(
        `research-summary-grid-item-${researchSummaries[0].id}`
      )
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(
        `research-summary-grid-item-${reversedResearchSummaries[0].id}`
      )
    ).toBeInTheDocument()
  })

  it('paginates research summaries', async () => {
    const firstBatch = buildEntities(13, buildResearchSummary)
    const secondBatch = buildEntities(12, buildResearchSummary)
    const category = {
      id: 'research-summaries-category-id',
      name: 'Sample category',
    }

    const client = {
      executeQuery: ({ variables }: { variables: TermQueryVariables }) => {
        const researchSummaries = variables.after ? secondBatch : firstBatch
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
                __typename: 'ResearchSummariesCategory',
                ...category,
                researchSummaries: {
                  pageInfo,
                  nodes: researchSummaries,
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
      screen.queryByTestId(`research-summary-grid-item-${firstBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`research-summary-grid-item-${secondBatch[0].id}`)
    ).toBeInTheDocument()

    expect(screen.getByTestId('term-next-page')).toBeDisabled()

    await userEvent.click(screen.getByTestId('term-previous-page'))

    expect(
      screen.getByTestId(`research-summary-grid-item-${firstBatch[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`research-summary-grid-item-${secondBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(screen.getByTestId('term-previous-page')).toBeDisabled()
  })
})
