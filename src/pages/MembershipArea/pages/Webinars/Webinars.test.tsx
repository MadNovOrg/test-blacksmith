import { format } from 'date-fns'
import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  WebinarsQuery,
  WebinarsQueryVariables,
  WpPageInfo,
} from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildEntities, buildWebinar } from '@test/mock-data-utils'

import Webinars from '.'

describe('page: Webinars', () => {
  it('displays skeleton while fetching webinars', () => {
    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/webinars']}>
          <Routes>
            <Route path="/webinars" element={<Webinars />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('featured-webinar-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('webinars-grid-skeleton')).toBeInTheDocument()
  })

  it('displays first webinar as a featured one', () => {
    const webinars = buildEntities(2, buildWebinar)

    const client = {
      executeQuery: () =>
        fromValue<{ data: WebinarsQuery }>({
          data: {
            content: {
              webinars: {
                nodes: webinars,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/webinars']}>
          <Routes>
            <Route path="/webinars" element={<Webinars />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(
      screen.queryByTestId('featured-webinar-skeleton')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('webinars-grid-skeleton')
    ).not.toBeInTheDocument()

    const featuredWebinar = screen.getByTestId('featured-webinar')

    expect(
      within(featuredWebinar).getByText(webinars[0].title ?? '')
    ).toBeInTheDocument()

    expect(within(featuredWebinar).getByText('New webinar')).toBeInTheDocument()

    expect(
      within(featuredWebinar).getByAltText(webinars[0].title ?? '')
    ).toHaveAttribute(
      'src',
      webinars[0].featuredImage?.node?.mediaItemUrl ?? ''
    )
  })

  it('navigates to single webinar page when clicked on featured image', () => {
    const webinars = buildEntities(2, buildWebinar)

    const client = {
      executeQuery: () =>
        fromValue<{ data: WebinarsQuery }>({
          data: {
            content: {
              webinars: {
                nodes: webinars,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/webinars']}>
          <Routes>
            <Route path="/webinars" element={<Webinars />} />
            <Route path="/webinars/:id" element={<p>Webinar page</p>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    const featuredWebinar = screen.getByTestId('featured-webinar')

    userEvent.click(
      within(featuredWebinar).getByAltText(webinars[0].title ?? '')
    )

    expect(screen.getByText('Webinar page')).toBeInTheDocument()
  })

  it('displays items in a grid', () => {
    const webinars = buildEntities(10, buildWebinar)

    const client = {
      executeQuery: () =>
        fromValue<{ data: WebinarsQuery }>({
          data: {
            content: {
              webinars: {
                nodes: webinars,
              },
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/webinars']}>
          <Routes>
            <Route path="/webinars" element={<Webinars />} />
          </Routes>
        </MemoryRouter>
      </Provider>
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

    const client = {
      executeQuery: ({ variables }: { variables: WebinarsQueryVariables }) => {
        const items = variables.term === SEARCH_TERM ? [filteredItem] : webinars

        return fromValue<{ data: WebinarsQuery }>({
          data: {
            content: {
              webinars: {
                nodes: items,
              },
            },
          },
        })
      },
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={['/webinars']}>
          <Routes>
            <Route path="/webinars" element={<Webinars />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    userEvent.type(screen.getByPlaceholderText('Search webinars'), SEARCH_TERM)

    await waitFor(() => {
      expect(
        screen.getByTestId(`webinar-grid-item-${filteredItem.id}`)
      ).toBeInTheDocument()
    })
  })

  it('paginates webinars', async () => {
    const firstBatch = buildEntities(13, buildWebinar)
    const secondBatch = buildEntities(12, buildWebinar)

    const client = {
      executeQuery: ({ variables }: { variables: WebinarsQueryVariables }) => {
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

        return fromValue<{ data: WebinarsQuery }>({
          data: {
            content: {
              webinars: {
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
        <MemoryRouter initialEntries={['/webinars']}>
          <Routes>
            <Route path="/webinars" element={<Webinars />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    userEvent.click(screen.getByTestId('webinars-next-page'))

    expect(
      within(screen.getByTestId('featured-webinar')).getByText(
        firstBatch[0].title ?? ''
      )
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`webinar-grid-item-${firstBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(
      screen.getByTestId(`webinar-grid-item-${secondBatch[0].id}`)
    ).toBeInTheDocument()

    expect(screen.getByTestId('webinars-next-page')).toBeDisabled()

    userEvent.click(screen.getByTestId('webinars-previous-page'))

    expect(
      within(screen.getByTestId('featured-webinar')).getByText(
        firstBatch[0].title ?? ''
      )
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(`webinar-grid-item-${firstBatch[0].id}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(`webinar-grid-item-${secondBatch[0].id}`)
    ).not.toBeInTheDocument()

    expect(screen.getByTestId('webinars-previous-page')).toBeDisabled()
  })
})
