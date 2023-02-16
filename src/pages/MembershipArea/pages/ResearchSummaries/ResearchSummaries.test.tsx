import { format } from 'date-fns'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  ResearchSummariesQuery,
  ResearchSummariesQueryVariables,
  WpPageInfo,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities, buildResearchSummary } from '@test/mock-data-utils'

import ResearchSummaries from '.'

describe('page: ResearchSummaries', () => {
  it('displays skeleton loading while fetching research summaries', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/research-summaries" element={<ResearchSummaries />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/research-summaries'] }
    )

    expect(
      screen.getByTestId('featured-research-summary-skeleton')
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('research-summaries-grid-skeleton')
    ).toBeInTheDocument()
  })

  it('displays first research summary as a featured one', () => {
    const researchSummaries = buildEntities(2, buildResearchSummary)

    const client = {
      executeQuery: () =>
        fromValue<{ data: ResearchSummariesQuery }>({
          data: {
            content: {
              researchSummaries: {
                nodes: researchSummaries,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/research-summaries" element={<ResearchSummaries />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/research-summaries'] }
    )

    expect(
      screen.queryByTestId('featured-research-summary-skeleton')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('research-summaries-grid-skeleton')
    ).not.toBeInTheDocument()

    const featuredResearchSummary = screen.getByTestId(
      'featured-research-summary'
    )

    expect(
      within(featuredResearchSummary).getByText(
        researchSummaries[0].title ?? ''
      )
    ).toBeInTheDocument()

    expect(
      within(featuredResearchSummary).getByText('New summary')
    ).toBeInTheDocument()

    expect(
      within(featuredResearchSummary).getByAltText(
        researchSummaries[0].title ?? ''
      )
    ).toHaveAttribute(
      'src',
      researchSummaries[0].featuredImage?.node?.mediaItemUrl ?? ''
    )

    expect(
      within(featuredResearchSummary).getByText('Download resource')
    ).toHaveAttribute(
      'href',
      researchSummaries[0].downloads?.file?.mediaItemUrl
    )
  })

  it('displays items in a grid', () => {
    const researchSummaries = buildEntities(10, buildResearchSummary)

    const client = {
      executeQuery: () =>
        fromValue<{ data: ResearchSummariesQuery }>({
          data: {
            content: {
              researchSummaries: {
                nodes: researchSummaries,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/research-summaries" element={<ResearchSummaries />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/research-summaries'] }
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

      expect(
        within(itemElement).getByText('Download resource')
      ).toHaveAttribute('href', item.downloads?.file?.mediaItemUrl ?? '')
    })
  })

  it('searches for a research summary', async () => {
    const researchSummaries = buildEntities(10, buildResearchSummary)
    const filteredItem = buildResearchSummary()
    const SEARCH_TERM = 'search term'

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: ResearchSummariesQueryVariables
      }) => {
        const items =
          variables.term === SEARCH_TERM ? [filteredItem] : researchSummaries

        return fromValue<{ data: ResearchSummariesQuery }>({
          data: {
            content: {
              researchSummaries: {
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
          <Route path="/research-summaries" element={<ResearchSummaries />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/research-summaries'] }
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

  it('paginates research summaries', async () => {
    const firstBatch = buildEntities(13, buildResearchSummary)
    const secondBatch = buildEntities(12, buildResearchSummary)

    const client = {
      executeQuery: ({
        variables,
      }: {
        variables: ResearchSummariesQueryVariables
      }) => {
        const items = variables.after ? secondBatch : firstBatch
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

        return fromValue<{ data: ResearchSummariesQuery }>({
          data: {
            content: {
              researchSummaries: {
                pageInfo,
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
          <Route path="/research-summaries" element={<ResearchSummaries />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/research-summaries'] }
    )

    await userEvent.click(screen.getByTestId('research-summaries-next-page'))

    expect(
      within(screen.getByTestId('featured-research-summary')).getByText(
        firstBatch[0].title ?? ''
      )
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`research-summary-grid-item-${firstBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`research-summary-grid-item-${secondBatch[0].id}`)
    ).toBeInTheDocument()

    expect(screen.getByTestId('research-summaries-next-page')).toBeDisabled()

    await userEvent.click(
      screen.getByTestId('research-summaries-previous-page')
    )

    expect(
      within(screen.getByTestId('featured-research-summary')).getByText(
        firstBatch[0].title ?? ''
      )
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(`research-summary-grid-item-${firstBatch[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`research-summary-grid-item-${secondBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId('research-summaries-previous-page')
    ).toBeDisabled()
  })
})
