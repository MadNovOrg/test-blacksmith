import React from 'react'

import {
  Course_Invite_Status_Enum,
  Course_Trainer_Type_Enum,
} from '@app/generated/graphql'

import {
  chance,
  render,
  screen,
  userEvent,
  waitForCalls,
  waitForElementToBeRemoved,
} from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { AcceptDeclineCourse } from '.'

const mockFetcher = jest.fn()
jest.mock('@app/hooks/use-fetcher', () => ({ useFetcher: () => mockFetcher }))

const tid = (s: string) => `AcceptDeclineCourse-${s}`

describe('AcceptDeclineCourse', () => {
  it('renders children if current user is not assigned trainer (tt-ops, etc)', async () => {
    _render()

    expect(screen.queryByTestId(tid('acceptBtn'))).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('declineBtn'))).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('declinedChip'))).not.toBeInTheDocument()
  })

  it('renders children if current user has accepted', async () => {
    _render(Course_Invite_Status_Enum.Accepted)

    expect(screen.queryByTestId(tid('acceptBtn'))).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('declineBtn'))).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('declinedChip'))).not.toBeInTheDocument()
  })

  it('renders declined status chip if user has declined', async () => {
    _render(Course_Invite_Status_Enum.Declined)

    expect(screen.getByTestId(tid('declinedChip'))).toBeInTheDocument()
    expect(screen.queryByText('FALLBACK_CONTENT')).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('acceptBtn'))).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('declineBtn'))).not.toBeInTheDocument()
  })

  it('renders accept and decline buttons if user has not accepted/declined', async () => {
    _render(Course_Invite_Status_Enum.Pending)

    expect(screen.getByTestId(tid('acceptBtn'))).toBeInTheDocument()
    expect(screen.getByTestId(tid('declineBtn'))).toBeInTheDocument()
    expect(screen.queryByText('FALLBACK_CONTENT')).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('modalSubmit'))).not.toBeInTheDocument()
  })

  it('calls onUpdate as expected when user ACCEPTS', async () => {
    const onUpdate = jest.fn()
    const { trainer } = _render(Course_Invite_Status_Enum.Pending, onUpdate)

    await userEvent.click(screen.getByTestId(tid('acceptBtn')))
    await userEvent.click(screen.getByTestId(tid('modalSubmit')))

    await waitForCalls(onUpdate)

    expect(onUpdate).toHaveBeenCalledWith(
      trainer,
      Course_Invite_Status_Enum.Accepted
    )
    expect(mockFetcher).toHaveBeenCalledWith(
      expect.stringContaining('mutation'),
      {
        id: trainer.id,
        status: Course_Invite_Status_Enum.Accepted,
      }
    )
  })

  it('calls onUpdate as expected when user DECLINES', async () => {
    const onUpdate = jest.fn()
    const { trainer } = _render(Course_Invite_Status_Enum.Pending, onUpdate)

    await userEvent.click(screen.getByTestId(tid('declineBtn')))
    await userEvent.click(screen.getByTestId(tid('modalSubmit')))

    await waitForCalls(onUpdate)

    expect(onUpdate).toHaveBeenCalledWith(
      trainer,
      Course_Invite_Status_Enum.Declined
    )
    expect(mockFetcher).toHaveBeenCalledWith(
      expect.stringContaining('mutation'),
      {
        id: trainer.id,
        status: Course_Invite_Status_Enum.Declined,
      }
    )
  })

  it('does not call onUpdate when user CANCELs', async () => {
    const onUpdate = jest.fn()
    _render(Course_Invite_Status_Enum.Pending, onUpdate)

    await userEvent.click(screen.getByTestId(tid('acceptBtn')))
    await userEvent.click(screen.getByTestId(tid('modalCancel')))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(tid('modalCancel'))
    )

    expect(onUpdate).not.toHaveBeenCalled()
    expect(mockFetcher).not.toHaveBeenCalled()
  })

  it('does not crash if fetcher throws', async () => {
    mockFetcher.mockRejectedValueOnce(Error('Failed for testing'))
    const logSpy = jest.spyOn(console, 'error').mockImplementation()

    const onUpdate = jest.fn()
    _render(Course_Invite_Status_Enum.Pending, onUpdate)

    await userEvent.click(screen.getByTestId(tid('acceptBtn')))
    await userEvent.click(screen.getByTestId(tid('modalSubmit')))

    await waitForCalls(mockFetcher)

    expect(onUpdate).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith(Error('Failed for testing'))
    expect(screen.getByTestId(tid('modalSubmit'))).toBeInTheDocument()
  })
})

/**
 * Helpers
 */

function _render(
  status = Course_Invite_Status_Enum.Accepted,
  onUpdate = jest.fn()
) {
  const trainer = {
    id: chance.guid(),
    type: Course_Trainer_Type_Enum.Leader,
    status,
  }
  const profile = buildProfile()

  render(
    <AcceptDeclineCourse trainer={trainer} onUpdate={onUpdate}>
      <div>FALLBACK_CONTENT</div>
    </AcceptDeclineCourse>,
    { auth: { profile } }
  )

  return { trainer }
}
