import React from 'react'
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom'

import { useFetcher } from '@app/hooks/use-fetcher'

import { AcceptInvite } from '.'

import { render, waitForText } from '@test/index'
import { InviteStatus } from '@app/types'

jest.mock('@app/hooks/use-fetcher', () => ({
  useFetcher: jest.fn(),
}))

const useFetcherMocked = jest.mocked(useFetcher)

const DummyParticipantPage = () => {
  const { id } = useParams()
  return <p>{id}</p>
}

describe('page: AcceptInvite', () => {
  const fetcherMocked = jest.fn()

  beforeEach(async () => {
    useFetcherMocked.mockReturnValue(fetcherMocked)
  })

  it('redirects to the participant course page if invitation accepted successfuly', async () => {
    fetcherMocked.mockResolvedValue({
      acceptInvite: { status: InviteStatus.ACCEPTED },
      addParticipant: { id: 'some-id' },
    })

    const INVITE_ID = 'invite-id'
    const COURSE_ID = 'course-id'

    render(
      <MemoryRouter
        initialEntries={[
          `/my-training/accept-invite/${INVITE_ID}?courseId=${COURSE_ID}`,
        ]}
      >
        <Routes>
          <Route
            path="/my-training/accept-invite/:id"
            element={<AcceptInvite />}
          />
          <Route
            path="/my-training/courses/:id"
            element={<DummyParticipantPage />}
          />
        </Routes>
      </MemoryRouter>
    )

    await waitForText(COURSE_ID)
  })

  it("displays an error if invitation didn't get accepted and doesn't redirect to the participant course page", async () => {
    fetcherMocked.mockResolvedValue({
      acceptInvite: null,
      addParticipant: null,
    })

    render(
      <MemoryRouter initialEntries={[`/my-training/accept-invite/course-id`]}>
        <Routes>
          <Route
            path="/my-training/accept-invite/:id"
            element={<AcceptInvite />}
          />
          <Route
            path="/my-training/courses/:id"
            element={<p>Participant page</p>}
          />
        </Routes>
      </MemoryRouter>
    )

    await waitForText(
      'There was an error accepting the invite. Please try again later.'
    )
  })
})
