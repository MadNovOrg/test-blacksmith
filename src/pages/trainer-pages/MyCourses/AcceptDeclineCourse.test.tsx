import React from 'react'

import { InviteStatus } from '@app/types'

import {
  render,
  screen,
  userEvent,
  waitForCalls,
  waitForElementToBeRemoved,
} from '@test/index'
import { buildCourse, buildCourseTrainer } from '@test/mock-data-utils'

import { AcceptDeclineCourse } from './AcceptDeclineCourse'

const mockFetcher = jest.fn()
jest.mock('@app/hooks/use-fetcher', () => ({ useFetcher: () => mockFetcher }))

const tid = (s: string) => `AcceptDeclineCourse-${s}`

describe('AcceptDeclineCourse', () => {
  it('renders children if current user is not assigned trainer (tt-ops, etc)', async () => {
    _render()

    expect(screen.getByText('FALLBACK_CONTENT')).toBeInTheDocument()
    expect(screen.queryByTestId(tid('acceptBtn'))).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('declineBtn'))).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('declinedChip'))).not.toBeInTheDocument()
  })

  it('renders children if current user has accepted', async () => {
    _render(InviteStatus.ACCEPTED)

    expect(screen.getByText('FALLBACK_CONTENT')).toBeInTheDocument()
    expect(screen.queryByTestId(tid('acceptBtn'))).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('declineBtn'))).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('declinedChip'))).not.toBeInTheDocument()
  })

  it('renders declined status chip if user has declined', async () => {
    _render(InviteStatus.DECLINED)

    expect(screen.getByTestId(tid('declinedChip'))).toBeInTheDocument()
    expect(screen.queryByText('FALLBACK_CONTENT')).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('acceptBtn'))).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('declineBtn'))).not.toBeInTheDocument()
  })

  it('renders accept and decline buttons if user has not accepted/declined', async () => {
    _render(InviteStatus.PENDING)

    expect(screen.getByTestId(tid('acceptBtn'))).toBeInTheDocument()
    expect(screen.getByTestId(tid('declineBtn'))).toBeInTheDocument()
    expect(screen.queryByText('FALLBACK_CONTENT')).not.toBeInTheDocument()
    expect(screen.queryByTestId(tid('modalSubmit'))).not.toBeInTheDocument()
  })

  it('calls onUpdate as expected when user ACCEPTS', async () => {
    const onUpdate = jest.fn()
    const { course, trainer } = _render(InviteStatus.PENDING, onUpdate)

    userEvent.click(screen.getByTestId(tid('acceptBtn')))
    userEvent.click(screen.getByTestId(tid('modalSubmit')))

    await waitForCalls(onUpdate)

    expect(onUpdate).toBeCalledWith(course, trainer, InviteStatus.ACCEPTED)
    expect(mockFetcher).toBeCalledWith(expect.stringContaining('mutation'), {
      id: trainer.id,
      status: InviteStatus.ACCEPTED,
    })
  })

  it('calls onUpdate as expected when user DECLINES', async () => {
    const onUpdate = jest.fn()
    const { course, trainer } = _render(InviteStatus.PENDING, onUpdate)

    userEvent.click(screen.getByTestId(tid('declineBtn')))
    userEvent.click(screen.getByTestId(tid('modalSubmit')))

    await waitForCalls(onUpdate)

    expect(onUpdate).toBeCalledWith(course, trainer, InviteStatus.DECLINED)
    expect(mockFetcher).toBeCalledWith(expect.stringContaining('mutation'), {
      id: trainer.id,
      status: InviteStatus.DECLINED,
    })
  })

  it('does not call onUpdate when user CANCELs', async () => {
    const onUpdate = jest.fn()
    _render(InviteStatus.PENDING, onUpdate)

    userEvent.click(screen.getByTestId(tid('acceptBtn')))
    userEvent.click(screen.getByTestId(tid('modalCancel')))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId(tid('modalCancel'))
    )

    expect(onUpdate).not.toBeCalled()
    expect(mockFetcher).not.toBeCalled()
  })

  it('does not crash if fetcher throws', async () => {
    mockFetcher.mockRejectedValueOnce(Error('Failed for testing'))
    const logSpy = jest.spyOn(console, 'error').mockImplementation()

    const onUpdate = jest.fn()
    _render(InviteStatus.PENDING, onUpdate)

    userEvent.click(screen.getByTestId(tid('acceptBtn')))
    userEvent.click(screen.getByTestId(tid('modalSubmit')))

    await waitForCalls(mockFetcher)

    expect(onUpdate).not.toBeCalled()
    expect(logSpy).toBeCalledWith(Error('Failed for testing'))
    expect(screen.getByTestId(tid('modalSubmit'))).toBeInTheDocument()
  })
})

/**
 * Helpers
 */

function _render(status = InviteStatus.ACCEPTED, onUpdate = jest.fn()) {
  const trainer = buildCourseTrainer({ overrides: { status } })
  const course = buildCourse({ overrides: { trainers: [trainer] } })

  const courseTrainer = course.trainers?.[0] ?? { id: undefined }
  expect(courseTrainer.id).toBe(trainer.id)

  render(
    <AcceptDeclineCourse course={course} onUpdate={onUpdate}>
      <div>FALLBACK_CONTENT</div>
    </AcceptDeclineCourse>,
    { auth: { profile: trainer.profile } }
  )

  return { trainer, course }
}
