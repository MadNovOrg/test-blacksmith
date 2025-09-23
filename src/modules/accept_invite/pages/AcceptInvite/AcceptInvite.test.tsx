import React from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { InviteStatus } from '@app/types'

import { _render, waitForText } from '@test/index'

import { AcceptInvite } from '.'

const DummyParticipantPage = () => {
  const { id } = useParams()
  return <p>{id}</p>
}

describe('page: AcceptInvite', () => {
  // eslint-disable-next-line vitest/expect-expect
  it('redirects to the participant course page if invitation accepted successfully', async () => {
    const client = {
      executeQuery: () => fromValue({ data: { course_participant: [] } }),
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

    _render(
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
      { initialEntries: [`/accept-invite/${INVITE_ID}?courseId=${COURSE_ID}`] },
    )

    await waitForText(COURSE_ID)
  })

  // eslint-disable-next-line vitest/expect-expect
  it("displays an error if invitation didn't get accepted and doesn't redirect to the participant course page", async () => {
    const client = {
      executeQuery: () => fromValue({ data: { course_participant: [] } }),
      executeMutation: () =>
        fromValue({
          data: { acceptInvite: undefined, addParticipant: undefined },
        }),
    } as unknown as Client

    _render(
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
      { initialEntries: [`/accept-invite/course-id`] },
    )

    await waitForText(
      'There was an error accepting the invite. Please try again later.',
    )
  })
})
