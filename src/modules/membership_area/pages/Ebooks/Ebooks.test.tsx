import { format } from 'date-fns'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  EbooksQuery,
  EbooksQueryVariables,
  WpPageInfo,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities, buildEbook } from '@test/mock-data-utils'

import Ebooks from '.'

describe('page: Ebooks', () => {
  it('displays skeleton loading while fetching ebooks', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/ebooks" element={<Ebooks />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/ebooks'] },
    )

    expect(screen.getByTestId('featured-ebook-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('ebooks-grid-skeleton')).toBeInTheDocument()
  })

  it('displays first ebook as a featured one', () => {
    const ebooks = buildEntities(2, buildEbook)

    const client = {
      executeQuery: () =>
        fromValue<{ data: EbooksQuery }>({
          data: {
            content: {
              ebooks: {
                nodes: ebooks,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/ebooks" element={<Ebooks />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/ebooks'] },
    )

    expect(
      screen.queryByTestId('featured-ebook-skeleton'),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('ebooks-grid-skeleton')).not.toBeInTheDocument()

    const featuredEbook = screen.getByTestId('featured-ebook')

    expect(
      within(featuredEbook).getByText(ebooks[0].title ?? ''),
    ).toBeInTheDocument()

    expect(within(featuredEbook).getByText('New ebook')).toBeInTheDocument()

    expect(
      within(featuredEbook).getByAltText(ebooks[0].title ?? ''),
    ).toHaveAttribute('src', ebooks[0].featuredImage?.node?.mediaItemUrl ?? '')

    expect(
      within(featuredEbook).getByText('Download resource'),
    ).toHaveAttribute('href', ebooks[0].downloads?.file?.mediaItemUrl)
  })

  it('displays items in a grid', () => {
    const ebooks = buildEntities(10, buildEbook)

    const client = {
      executeQuery: () =>
        fromValue<{ data: EbooksQuery }>({
          data: {
            content: {
              ebooks: {
                nodes: ebooks,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/ebooks" element={<Ebooks />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/ebooks'] },
    )

    ebooks.forEach(item => {
      const itemElement = screen.getByTestId(`ebook-grid-item-${item.id}`)

      expect(
        within(itemElement).getByText(item.title ?? ''),
      ).toBeInTheDocument()
      expect(
        within(itemElement).getByAltText(item.title ?? ''),
      ).toHaveAttribute('src', item.featuredImage?.node?.mediaItemUrl ?? '')

      expect(
        within(itemElement).getByText(
          format(new Date(item.date ?? ''), 'd MMMM yyyy'),
        ),
      ).toBeInTheDocument()

      expect(
        within(itemElement).getByText('Download resource'),
      ).toHaveAttribute('href', item.downloads?.file?.mediaItemUrl ?? '')
    })
  })

  it('searches for ebooks', async () => {
    const ebooks = buildEntities(10, buildEbook)
    const filteredItem = buildEbook()
    const SEARCH_TERM = 'search term'

    const client = {
      executeQuery: ({ variables }: { variables: EbooksQueryVariables }) => {
        const items = variables.term === SEARCH_TERM ? [filteredItem] : ebooks

        return fromValue<{ data: EbooksQuery }>({
          data: {
            content: {
              ebooks: {
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
          <Route path="/ebooks" element={<Ebooks />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/ebooks'] },
    )

    await userEvent.type(
      screen.getByPlaceholderText('Search ebooks'),
      SEARCH_TERM,
    )

    await waitFor(() => {
      expect(
        screen.getByTestId(`ebook-grid-item-${filteredItem.id}`),
      ).toBeInTheDocument()
    })
  })

  it('paginates ebooks', async () => {
    const firstBatch = buildEntities(13, buildEbook)
    const secondBatch = buildEntities(12, buildEbook)

    const client = {
      executeQuery: ({ variables }: { variables: EbooksQueryVariables }) => {
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

        return fromValue<{ data: EbooksQuery }>({
          data: {
            content: {
              ebooks: {
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
          <Route path="/ebooks" element={<Ebooks />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: ['/ebooks'] },
    )

    await userEvent.click(screen.getByTestId('ebooks-next-page'))

    expect(
      within(screen.getByTestId('featured-ebook')).getByText(
        firstBatch[0].title ?? '',
      ),
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`ebook-grid-item-${firstBatch[0].id}`),
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`ebook-grid-item-${secondBatch[0].id}`),
    ).toBeInTheDocument()

    expect(screen.getByTestId('ebooks-next-page')).toBeDisabled()

    await userEvent.click(screen.getByTestId('ebooks-previous-page'))

    expect(
      within(screen.getByTestId('featured-ebook')).getByText(
        firstBatch[0].title ?? '',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(`ebook-grid-item-${firstBatch[0].id}`),
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`ebook-grid-item-${secondBatch[0].id}`),
    ).not.toBeInTheDocument()

    expect(screen.getByTestId('ebooks-previous-page')).toBeDisabled()
  })
})
