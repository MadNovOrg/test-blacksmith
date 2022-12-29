import { format } from 'date-fns'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Client, CombinedError, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import { PodcastQuery } from '@app/generated/graphql'

import { render, screen, userEvent, waitForText } from '@test/index'
import { buildEntities, buildPodcast } from '@test/mock-data-utils'

import Podcast from '.'

describe('page: Podcast', () => {
  it('displays skeleton while loading the podcast', () => {
    const PODCAST_ID = 'podcast-id'

    const client = {
      executeQuery: () => never,
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/${PODCAST_ID}`]}>
          <Routes>
            <Route path="/:id" element={<Podcast />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByTestId('back-nav-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('title-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('description-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('recent-podcasts-skeleton')).toBeInTheDocument()
  })

  it('displays a message when podcast is not found', () => {
    const PODCAST_ID = 'podcast-id'

    const client = {
      executeQuery: () =>
        fromValue<{ data: PodcastQuery }>({
          data: {
            podcast: {
              podcast: null,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/${PODCAST_ID}`]}>
          <Routes>
            <Route path="/:id" element={<Podcast />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Podcast not found')).toBeInTheDocument()
  })

  it("displays error message if can't load the podcast", () => {
    const client = {
      executeQuery: () =>
        fromValue({
          error: new CombinedError({
            networkError: Error('something went wrong!'),
          }),
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/not-found`]}>
          <Routes>
            <Route path="/" element={<>Podcasts page</>} />
            <Route path=":id" element={<Podcast />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(
      screen.getByText('There was an error loading the podcast')
    ).toBeInTheDocument()
  })

  it('displays podcast info and the player', () => {
    const PODCAST_ID = 'podcast-id'
    const podcast = buildPodcast()

    const client = {
      executeQuery: () =>
        fromValue<{ data: PodcastQuery }>({
          data: {
            podcast: {
              podcast,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/${PODCAST_ID}`]}>
          <Routes>
            <Route path="/" element={<>Podcasts page</>} />
            <Route path=":id" element={<Podcast />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText(podcast.name)).toBeInTheDocument()
    expect(screen.getByText(`by ${podcast.author}`)).toBeInTheDocument()
    expect(
      screen.getByText(format(new Date(podcast.publishedDate), 'd MMMM yyyy'))
    ).toBeInTheDocument()
  })

  it('links back to the podcasts page', async () => {
    const PODCAST_ID = 'podcast-id'
    const podcast = buildPodcast()

    const client = {
      executeQuery: () =>
        fromValue<{ data: PodcastQuery }>({
          data: {
            podcast: {
              podcast,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/${PODCAST_ID}`]}>
          <Routes>
            <Route path="/" element={<>Podcasts page</>} />
            <Route path=":id" element={<Podcast />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    userEvent.click(screen.getByText('Podcasts'))

    await waitForText('Podcasts page')
  })

  it('displays recent podcasts', () => {
    const PODCAST_ID = 'podcast-id'
    const podcast = buildPodcast()
    const recentPodcasts = buildEntities(4, buildPodcast)

    const client = {
      executeQuery: () =>
        fromValue<{ data: PodcastQuery }>({
          data: {
            podcast: {
              podcast,
            },
            recentPodcasts: {
              records: recentPodcasts,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <MemoryRouter initialEntries={[`/${PODCAST_ID}`]}>
          <Routes>
            <Route path="/" element={<>Podcasts page</>} />
            <Route path=":id" element={<Podcast />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    recentPodcasts.forEach(podcast => {
      expect(
        screen.getByTestId(`podcast-grid-item-${podcast.id}`)
      ).toBeInTheDocument()
    })
  })
})
