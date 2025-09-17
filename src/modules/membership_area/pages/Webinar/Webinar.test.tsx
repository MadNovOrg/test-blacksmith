import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import { WebinarQuery } from '@app/generated/graphql'

import { screen, _render, within } from '@test/index'
import { buildEntities, buildWebinar } from '@test/mock-data-utils'

import Webinar from '.'

describe('page: Webinar', () => {
  it('displays skeleton while loading the content', () => {
    const WEBINAR_ID = 'webinar-id'

    const client = {
      executeQuery: () => never,
    }

    _render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/webinars/:id" element={<Webinar />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/webinars/${WEBINAR_ID}`] },
    )

    expect(screen.getByTestId('back-nav-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('title-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('description-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('recent-webinars-skeleton')).toBeInTheDocument()
  })

  it('displays an alert if webinar is not found', () => {
    const WEBINAR_ID = 'webinar-id'

    const client = {
      executeQuery: () =>
        fromValue<{ data: WebinarQuery }>({
          data: {
            content: {
              webinar: null,
              recentWebinars: {
                nodes: buildEntities(4, buildWebinar),
              },
            },
          },
        }),
    }

    _render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/webinars/:id" element={<Webinar />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/webinars/${WEBINAR_ID}`] },
    )

    expect(screen.getByText('Webinar not found')).toBeInTheDocument()
  })

  it('displays webinar details', () => {
    const WEBINAR_ID = 'webinar-id'
    const webinar = buildWebinar({ overrides: { id: WEBINAR_ID } })

    const client = {
      executeQuery: () =>
        fromValue<{ data: WebinarQuery }>({
          data: {
            content: {
              webinar,
              recentWebinars: {
                nodes: buildEntities(4, buildWebinar),
              },
            },
          },
        }),
    }

    _render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/webinars/:id" element={<Webinar />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/webinars/${WEBINAR_ID}`] },
    )

    expect(screen.getByTestId('webinar-title')).toHaveTextContent(
      webinar.title ?? '',
    )

    const description = screen.getByTestId('webinar-description').textContent
    expect(webinar.excerpt).toContain(description)
  })

  it('displays recent webinars', () => {
    const WEBINAR_ID = 'webinar-id'
    const webinar = buildWebinar({ overrides: { id: WEBINAR_ID } })

    const recentWebinars = buildEntities(4, buildWebinar)

    const client = {
      executeQuery: () =>
        fromValue<{ data: WebinarQuery }>({
          data: {
            content: {
              webinar,
              recentWebinars: {
                nodes: recentWebinars,
              },
            },
          },
        }),
    }

    _render(
      <Provider value={client as unknown as Client}>
        <Routes>
          <Route path="/webinars/:id" element={<Webinar />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/webinars/${WEBINAR_ID}`] },
    )

    recentWebinars.forEach(relatedItem => {
      const relatedItemEl = screen.getByTestId(
        `webinars-grid-item-${relatedItem.id}`,
      )

      expect(
        within(relatedItemEl).getByText(relatedItem.title ?? ''),
      ).toBeInTheDocument()

      expect(
        within(relatedItemEl).getByAltText(relatedItem.title ?? ''),
      ).toHaveAttribute(
        'src',
        relatedItem.featuredImage?.node?.mediaItemUrl ?? '',
      )
    })
  })
})
