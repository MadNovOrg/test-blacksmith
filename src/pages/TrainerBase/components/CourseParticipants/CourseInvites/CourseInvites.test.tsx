import React from 'react'

import useCourseInvites from '@app/hooks/useCourseInvites'

import { CourseInvites } from './CourseInvites'

import { render, waitForCalls, chance, userEvent } from '@test/index'
import { buildCourse, buildInvite } from '@test/mock-data-utils'

jest.mock('@app/hooks/useCourseInvites')
const useCourseInvitesMock = jest.mocked(useCourseInvites)
const useCourseInvitesDefaults = {
  list: [],
  total: 0,
  error: undefined,
  send: jest.fn(),
  refetch: jest.fn(),
}

describe('CourseInvites', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders as expected', async () => {
    const course = buildCourse()
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    const { queryByTestId } = render(<CourseInvites course={course} />)

    const expectedMsg = `${course.max_participants} invites left`
    expect(queryByTestId('invites-left')).toHaveTextContent(expectedMsg)
    expect(queryByTestId('course-invite-btn')).toBeInTheDocument()
  })

  it('shows modal when clicked', async () => {
    const course = buildCourse()
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    const { getByTestId } = render(<CourseInvites course={course} />)
    userEvent.click(getByTestId('course-invite-btn'))

    const expectedMsg = `${course.max_participants} invites left`
    expect(getByTestId('modal-invites-left')).toHaveTextContent(expectedMsg)
  })

  it('renders invite button disabled when no invites left', async () => {
    const course = buildCourse({ overrides: { max_participants: 3 } })
    useCourseInvitesMock.mockReturnValue({
      ...useCourseInvitesDefaults,
      list: [buildInvite(), buildInvite(), buildInvite()],
    })

    const { getByTestId } = render(<CourseInvites course={course} />)
    const inviteBtn = getByTestId('course-invite-btn')

    expect(inviteBtn).toBeDisabled()
    expect(getByTestId('invites-left')).toHaveTextContent('0 invites left')
  })

  it('shows correct invites left count', async () => {
    const course = buildCourse()
    useCourseInvitesMock.mockReturnValue({
      ...useCourseInvitesDefaults,
      list: [
        buildInvite(),
        buildInvite({ overrides: { status: 'ACCEPTED' } }),
        buildInvite({ overrides: { status: 'DECLINED' } }),
      ],
    })

    const { getByTestId } = render(<CourseInvites course={course} />)
    userEvent.click(getByTestId('course-invite-btn'))

    const invitesNotDeclined = 2
    const invitesLeft = course.max_participants - invitesNotDeclined
    const expectedMsg = `${invitesLeft} invites left`
    expect(getByTestId('invites-left')).toHaveTextContent(expectedMsg)
    expect(getByTestId('modal-invites-left')).toHaveTextContent(expectedMsg)
  })

  it('does not accept invalid emails', async () => {
    const course = buildCourse()
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    const { getByTestId } = render(<CourseInvites course={course} />)
    userEvent.click(getByTestId('course-invite-btn'))

    const autocomplete = getByTestId('modal-invites-emails')
    const input = autocomplete.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('')

    const emails = ['not a valid email']
    userEvent.type(input, emails[0])
    userEvent.type(autocomplete, '{enter}')

    expect(input.value).toBe(emails[0]) // chip not created

    userEvent.click(getByTestId('modal-invites-send'))
    expect(useCourseInvitesDefaults.send).not.toBeCalled()
  })

  it('calls invites.send with a single valid email address', async () => {
    const course = buildCourse()
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    const { getByTestId } = render(<CourseInvites course={course} />)
    userEvent.click(getByTestId('course-invite-btn'))

    const autocomplete = getByTestId('modal-invites-emails')
    const input = autocomplete.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('')

    const emails = [chance.email()]
    userEvent.type(input, emails[0])
    userEvent.type(autocomplete, '{enter}')

    userEvent.click(getByTestId('modal-invites-send'))
    await waitForCalls(useCourseInvitesDefaults.send)

    expect(useCourseInvitesDefaults.send).toBeCalledWith(emails)
  })

  it('calls invites.send with a csv email addresses', async () => {
    const course = buildCourse()
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    const { getByTestId } = render(<CourseInvites course={course} />)
    userEvent.click(getByTestId('course-invite-btn'))

    const autocomplete = getByTestId('modal-invites-emails')
    const input = autocomplete.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('')

    const emails = [chance.email(), chance.email(), chance.email()]
    userEvent.type(input, emails.join(', '))
    userEvent.type(autocomplete, '{enter}')

    userEvent.click(getByTestId('modal-invites-send'))
    await waitForCalls(useCourseInvitesDefaults.send)

    expect(useCourseInvitesDefaults.send).toBeCalledWith(emails)
  })

  it('calls invites.send when all emails are valid', async () => {
    const course = buildCourse()
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    const { getByTestId } = render(<CourseInvites course={course} />)
    userEvent.click(getByTestId('course-invite-btn'))

    const autocomplete = getByTestId('modal-invites-emails')
    const input = autocomplete.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('')

    const emails = [chance.email(), chance.email(), chance.email()]
    for (const email of emails) {
      userEvent.type(input, email)
      userEvent.type(autocomplete, '{enter}')
      expect(input.value).toBe('')
    }

    userEvent.click(getByTestId('modal-invites-send'))
    await waitForCalls(useCourseInvitesDefaults.send)

    expect(useCourseInvitesDefaults.send).toBeCalledWith(emails)
  })

  it('calls invites.send with left overs (not tagged)', async () => {
    const course = buildCourse()
    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    const { getByTestId } = render(<CourseInvites course={course} />)
    userEvent.click(getByTestId('course-invite-btn'))

    const autocomplete = getByTestId('modal-invites-emails')
    const input = autocomplete.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('')

    const [email, leftOver] = [chance.email(), chance.email()]
    userEvent.type(input, email)
    userEvent.type(autocomplete, '{enter}')

    expect(input.value).toBe('')
    userEvent.type(input, leftOver)

    userEvent.click(getByTestId('modal-invites-send'))
    await waitForCalls(useCourseInvitesDefaults.send)

    expect(useCourseInvitesDefaults.send).toBeCalledWith([email, leftOver])
  })
})
