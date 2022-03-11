import React from 'react'
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom'

import useAcceptInvite from '@app/hooks/useAcceptInvite'

import { AcceptInvite } from '.'

import { render, screen } from '@test/index'
import { LoadingStatus } from '@app/util'

jest.mock('@app/hooks/useAcceptInvite')

const useAcceptInviteMock = jest.mocked(useAcceptInvite)

const DummyParticipantPage = () => {
  const { id } = useParams()
  return <p>{id}</p>
}

describe('page: AcceptInvite', () => {
  it('redirects to the participant course page if invitation accepted successfuly', () => {
    const COURSE_ID = 'course-id'

    useAcceptInviteMock.mockReturnValue({ status: LoadingStatus.SUCCESS })

    render(
      <MemoryRouter
        initialEntries={[`/my-training/accept-invite/${COURSE_ID}`]}
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

    expect(screen.getByText(COURSE_ID)).toBeInTheDocument()
  })

  it("displays an error if invitation didn't get accepted and doesn't redirect to the participant course page", () => {
    useAcceptInviteMock.mockReturnValue({ status: LoadingStatus.ERROR })

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

    expect(screen.queryByText('Participant page')).not.toBeInTheDocument()
    expect(screen.getByTestId('accept-invite-error-alert'))
  })
})
