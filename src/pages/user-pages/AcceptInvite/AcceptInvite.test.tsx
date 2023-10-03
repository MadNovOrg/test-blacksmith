import React from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { useFetcher } from '@app/hooks/use-fetcher'
import { InviteStatus } from '@app/types'

import { render, waitForText } from '@test/index'

import { AcceptInvite } from '.'

vi.mock('@app/hooks/use-fetcher', () => ({
  useFetcher: vi.fn(),
}))

const useFetcherMocked = vi.mocked(useFetcher)

const DummyParticipantPage = () => {
  const { id } = useParams()
  return <p>{id}</p>
}

describe('page: AcceptInvite', () => {
  const fetcherMocked = vi.fn()

  beforeEach(async () => {
    useFetcherMocked.mockReturnValue(fetcherMocked)
  })

  // eslint-disable-next-line vitest/expect-expect
  it('redirects to the participant course page if invitation accepted successfuly', async () => {
    const client = {
      executeMutation: () =>
        fromValue({
          data: {
            acceptInvite: { status: InviteStatus.ACCEPTED },
            addParticipant: { id: 'some-id' },
          },
        }),
    } as unknown as Client

    const INVITE_ID = 'invite-id'
    const COURSE_ID = 'course-id'

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/accept-invite/:id" element={<AcceptInvite />} />
          <Route
            path="/courses/:id/details"
            element={<DummyParticipantPage />}
          />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/accept-invite/${INVITE_ID}?courseId=${COURSE_ID}`] }
    )

    await waitForText(COURSE_ID)
  })

  // eslint-disable-next-line vitest/expect-expect
  it("displays an error if invitation didn't get accepted and doesn't redirect to the participant course page", async () => {
    const client = {
      executeMutation: () =>
        fromValue({
          data: { acceptInvite: undefined, addParticipant: undefined },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/accept-invite/:id" element={<AcceptInvite />} />
          <Route
            path="/courses/:id/details"
            element={<p>Participant page</p>}
          />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/accept-invite/course-id`] }
    )

    await waitForText(
      'There was an error accepting the invite. Please try again later.'
    )
  })
})
