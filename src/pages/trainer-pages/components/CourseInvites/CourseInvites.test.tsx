import { add, sub } from 'date-fns'
import React from 'react'

import useCourseInvites from '@app/hooks/useCourseInvites'
import { Course, CourseType, InviteStatus, RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { chance, render, screen, userEvent, waitForCalls } from '@test/index'
import {
  buildCourse,
  buildCourseSchedule,
  buildInvite,
} from '@test/mock-data-utils'

import { CourseInvites } from './CourseInvites'

jest.mock('@app/hooks/useCourseInvites')
const useCourseInvitesMock = jest.mocked(useCourseInvites)
const useCourseInvitesDefaults = {
  data: [],
  total: 0,
  status: LoadingStatus.FETCHING,
  error: undefined,
  send: jest.fn(),
  resend: jest.fn(),
  cancel: jest.fn(),
  invalidateCache: jest.fn(),
}

describe('CourseInvites', () => {
  let course: Course
  beforeEach(() => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: add(new Date(), { days: 2 }).toISOString(),
        end: add(new Date(), { days: 4 }).toISOString(),
      },
    })
    course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })
  })

  it('renders as expected', async () => {
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    const expectedMsg = `${course.max_participants} invites left`
    expect(screen.getByTestId('invites-left')).toHaveTextContent(expectedMsg)
    expect(screen.getByTestId('course-invite-btn')).toBeInTheDocument()
  })

  it('does not render after course started', async () => {
    course = buildCourse({
      overrides: {
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: sub(new Date(), { days: 2 }).toISOString(),
              end: add(new Date(), { days: 4 }).toISOString(),
            },
          }),
        ],
      },
    })
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })
    expect(screen.queryByTestId('course-invite-btn')).not.toBeInTheDocument()
  })

  it('does not render if it is an open course', async () => {
    course = buildCourse({
      overrides: {
        type: CourseType.OPEN,
      },
    })
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)
    render(<CourseInvites course={course} />)

    expect(screen.queryByTestId('course-invite-btn')).not.toBeInTheDocument()
  })

  it('shows modal when clicked', async () => {
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    await userEvent.click(screen.getByTestId('course-invite-btn'))

    const expectedMsg = `${course.max_participants} invites left`
    expect(screen.getByTestId('modal-invites-left')).toHaveTextContent(
      expectedMsg
    )
  })

  it('renders invite button disabled when no invites left', async () => {
    course = {
      ...course,
      max_participants: 3,
    }
    useCourseInvitesMock.mockReturnValue({
      ...useCourseInvitesDefaults,
      data: [buildInvite(), buildInvite(), buildInvite()],
    })

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    const inviteBtn = screen.getByTestId('course-invite-btn')

    expect(inviteBtn).toBeDisabled()

    expect(screen.getByTestId('invites-left')).toHaveTextContent(
      '0 invites left'
    )
  })

  it('shows correct invites left count', async () => {
    useCourseInvitesMock.mockReturnValue({
      ...useCourseInvitesDefaults,
      data: [
        buildInvite(),
        buildInvite({ overrides: { status: InviteStatus.ACCEPTED } }),
        buildInvite({ overrides: { status: InviteStatus.DECLINED } }),
      ],
    })

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    await userEvent.click(screen.getByTestId('course-invite-btn'))

    const invitesPending = 1
    const invitesLeft = course.max_participants - invitesPending
    const expectedMsg = `${invitesLeft} invites left`

    expect(screen.getByTestId('invites-left')).toHaveTextContent(expectedMsg)
    expect(screen.getByTestId('modal-invites-left')).toHaveTextContent(
      expectedMsg
    )
  })

  it('shows take participants into account when showing invites left count', async () => {
    useCourseInvitesMock.mockReturnValue({
      ...useCourseInvitesDefaults,
      data: [
        buildInvite(),
        buildInvite({ overrides: { status: InviteStatus.ACCEPTED } }),
        buildInvite({ overrides: { status: InviteStatus.DECLINED } }),
      ],
    })

    const participants = chance.integer({ min: 1, max: 3 })

    render(<CourseInvites course={course} attendeesCount={participants} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    await userEvent.click(screen.getByTestId('course-invite-btn'))

    const invitesPending = 1
    const invitesLeft = course.max_participants - invitesPending - participants
    const expectedMsg = `${invitesLeft} invites left`

    expect(screen.getByTestId('invites-left')).toHaveTextContent(expectedMsg)
    expect(screen.getByTestId('modal-invites-left')).toHaveTextContent(
      expectedMsg
    )
  })

  it('does not accept invalid emails', async () => {
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    await userEvent.click(screen.getByTestId('course-invite-btn'))

    const autocomplete = screen.getByTestId('modal-invites-emails')
    const input = autocomplete.querySelector('input') as HTMLInputElement

    expect(input.value).toBe('')

    const emails = ['not a valid email']
    await userEvent.type(input, emails[0])
    await userEvent.type(autocomplete, '{enter}')

    expect(input.value).toBe(emails[0]) // chip not created

    await userEvent.click(screen.getByTestId('modal-invites-send'))

    expect(useCourseInvitesDefaults.send).not.toHaveBeenCalled()
  })

  it('calls invites.send with a single valid email address', async () => {
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    await userEvent.click(screen.getByTestId('course-invite-btn'))

    const autocomplete = screen.getByTestId('modal-invites-emails')
    const input = autocomplete.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('')

    const emails = [chance.email()]
    await userEvent.type(input, emails[0])
    await userEvent.type(autocomplete, '{enter}')

    await userEvent.click(screen.getByTestId('modal-invites-send'))
    await waitForCalls(useCourseInvitesDefaults.send)

    expect(useCourseInvitesDefaults.send).toHaveBeenCalledWith(emails)
  })

  it('calls invites.send with a csv email addresses', async () => {
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    await userEvent.click(screen.getByTestId('course-invite-btn'))

    const autocomplete = screen.getByTestId('modal-invites-emails')
    const input = autocomplete.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('')

    const emails = [chance.email(), chance.email(), chance.email()]
    await userEvent.type(input, emails.join(', '))
    await userEvent.type(autocomplete, '{enter}')

    await userEvent.click(screen.getByTestId('modal-invites-send'))
    await waitForCalls(useCourseInvitesDefaults.send)

    expect(useCourseInvitesDefaults.send).toHaveBeenCalledWith(emails)
  })

  it('calls invites.send when all emails are valid', async () => {
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })
    await userEvent.click(screen.getByTestId('course-invite-btn'))

    const autocomplete = screen.getByTestId('modal-invites-emails')
    const input = autocomplete.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('')

    const emails = [chance.email(), chance.email(), chance.email()]
    for (const email of emails) {
      await userEvent.type(input, email)
      await userEvent.type(autocomplete, '{enter}')
      expect(input.value).toBe('')
    }

    await userEvent.click(screen.getByTestId('modal-invites-send'))
    await waitForCalls(useCourseInvitesDefaults.send)

    expect(useCourseInvitesDefaults.send).toHaveBeenCalledWith(emails)
  })

  it('calls invites.send with left overs (not tagged)', async () => {
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    await userEvent.click(screen.getByTestId('course-invite-btn'))

    const autocomplete = screen.getByTestId('modal-invites-emails')
    const input = autocomplete.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('')

    const [email, leftOver] = [chance.email(), chance.email()]
    await userEvent.type(input, email)
    await userEvent.type(autocomplete, '{enter}')

    expect(input.value).toBe('')
    await userEvent.type(input, leftOver)

    await userEvent.click(screen.getByTestId('modal-invites-send'))
    await waitForCalls(useCourseInvitesDefaults.send)

    expect(useCourseInvitesDefaults.send).toHaveBeenCalledWith([
      email,
      leftOver,
    ])
  })

  it('should accept emails with whitespace paddings', async () => {
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    await userEvent.click(screen.getByTestId('course-invite-btn'))

    const autocomplete = screen.getByTestId('modal-invites-emails')
    const input = autocomplete.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('')

    const emails = [` ${chance.email()}`, `${chance.email()} `]
    await userEvent.type(input, emails.join(' '))
    await userEvent.type(autocomplete, '{enter}')

    await userEvent.click(screen.getByTestId('modal-invites-send'))
    await waitForCalls(useCourseInvitesDefaults.send)

    expect(useCourseInvitesDefaults.send).toHaveBeenCalledWith(
      emails.map(e => e.trim())
    )
  })

  it("doesn't display the invite attendees button for trainers on a closed course", () => {
    const course = buildCourse({
      overrides: {
        type: CourseType.CLOSED,
      },
    })

    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TRAINER },
    })

    expect(
      screen.queryByRole('button', { name: /invite attendees/i })
    ).not.toBeInTheDocument()
  })
})
