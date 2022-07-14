import userEvent from '@testing-library/user-event'
import React from 'react'

import useCourse from '@app/hooks/useCourse'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useWaitlist } from '@app/hooks/useWaitlist'
import { Course, CourseParticipant } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen, within } from '@test/index'
import {
  buildCourse,
  buildParticipant,
  buildWaitlistEntry,
} from '@test/mock-data-utils'

import { CourseAttendees } from '.'

jest.mock('@app/hooks/useCourse')
jest.mock('@app/hooks/useWaitlist')
jest.mock('@app/hooks/useCourseParticipants')

const useCourseMock = useCourse as jest.MockedFunction<typeof useCourse>
const useWaitlistMock = useWaitlist as jest.MockedFunction<typeof useWaitlist>
const useCourseParticipantsMock = useCourseParticipants as jest.MockedFunction<
  typeof useCourseParticipants
>

const emptyWaitlistResponse = {
  data: [],
  isLoading: false,
  total: 0,
  error: undefined,
}

describe('component: CourseAttendees', () => {
  let course: Course

  afterEach(() => {
    jest.clearAllMocks()
    course = buildCourse()
  })

  it('displays a spinner while loading course participants', () => {
    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      status: LoadingStatus.SUCCESS,
      data: course,
    })

    useWaitlistMock.mockReturnValue(emptyWaitlistResponse)

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.FETCHING,
    })

    render(<CourseAttendees course={course} />)

    expect(
      screen.getByTestId('course-participants-fetching')
    ).toBeInTheDocument()
  })

  it('displays a table if a course has participants', () => {
    const participants = [
      buildParticipant(),
      buildParticipant(),
      buildParticipant(),
    ]

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      total: participants.length,
    })

    useWaitlistMock.mockReturnValue(emptyWaitlistResponse)

    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      status: LoadingStatus.SUCCESS,
      data: course,
    })

    render(<CourseAttendees course={course} />)

    participants.forEach(participant => {
      expect(screen.getByTestId(`course-participant-row-${participant.id}`))
    })

    const participantRow = screen.getByTestId(
      `course-participant-row-${participants[0].id}`
    )

    expect(
      within(participantRow).getByText(`${participants[0].profile.fullName}`)
    ).toBeInTheDocument()

    expect(within(participantRow).getByText(participants[0].profile.email))

    expect(
      within(participantRow).getByText(
        participants[0].profile.organizations[0].organization?.name ?? ''
      )
    ).toBeInTheDocument()
  })

  it('displays a message if no one has registered yet', () => {
    const participants: CourseParticipant[] = []

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      total: participants.length,
    })

    useWaitlistMock.mockReturnValue(emptyWaitlistResponse)

    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      status: LoadingStatus.SUCCESS,
      data: course,
    })

    render(<CourseAttendees course={course} />)

    const noAttendeesMesage = screen.getByTestId(
      'course-participants-zero-message'
    )

    expect(
      within(noAttendeesMesage).getByText('No invites accepted')
    ).toBeInTheDocument()
  })

  it('paginates course participants', () => {
    const PER_PAGE = 12

    const participants = new Array(PER_PAGE).map(() => buildParticipant())

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      total: 15,
    })

    useWaitlistMock.mockReturnValue(emptyWaitlistResponse)

    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      status: LoadingStatus.SUCCESS,
      data: course,
    })

    render(<CourseAttendees course={course} />)

    useCourseParticipantsMock.mockClear()

    userEvent.click(screen.getByTitle('Go to next page'))

    expect(useCourseParticipantsMock).toHaveBeenCalledTimes(1)
    expect(useCourseParticipantsMock.mock.calls[0]).toEqual([
      course.id,
      {
        order: 'asc',
        pagination: {
          limit: PER_PAGE,
          offset: PER_PAGE,
        },
        sortBy: 'name',
      },
    ])
  })

  it('sorts descending by participants name', () => {
    const PER_PAGE = 12

    const participants = new Array(PER_PAGE).map(() => buildParticipant())

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      total: 15,
    })

    useWaitlistMock.mockReturnValue(emptyWaitlistResponse)

    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      status: LoadingStatus.SUCCESS,
      data: course,
    })

    render(<CourseAttendees course={course} />)

    useCourseParticipantsMock.mockClear()

    userEvent.click(screen.getByText('Name'))

    expect(useCourseParticipantsMock).toHaveBeenCalledTimes(1)
    expect(useCourseParticipantsMock.mock.calls[0]).toEqual([
      course.id,
      {
        order: 'desc',
        pagination: {
          limit: PER_PAGE,
          offset: 0,
        },
        sortBy: 'name',
      },
    ])
  })

  it('displays course waitlist', () => {
    const waitlist = [
      buildWaitlistEntry(),
      buildWaitlistEntry(),
      buildWaitlistEntry(),
    ]

    const participants = [
      buildParticipant(),
      buildParticipant(),
      buildParticipant(),
    ]

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      total: 3,
    })

    useWaitlistMock.mockReturnValue({
      data: waitlist,
      isLoading: false,
      total: waitlist.length,
      error: undefined,
    })

    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      status: LoadingStatus.SUCCESS,
      data: course,
    })

    render(<CourseAttendees course={course} />)

    useCourseParticipantsMock.mockClear()
    useWaitlistMock.mockClear()

    userEvent.click(screen.getByText('Waitlist (3)'))

    expect(useWaitlistMock).toHaveBeenCalledTimes(2)
    expect(useWaitlistMock.mock.calls[0]).toMatchObject([
      {
        courseId: 0,
        sort: { by: 'createdAt', dir: 'asc' },
      },
    ])
    expect(useWaitlistMock.mock.calls[1]).toMatchObject([
      {
        courseId: course.id,
        sort: { by: 'createdAt', dir: 'asc' },
        limit: 12,
        offset: 0,
      },
    ])

    expect(screen.getByTestId('waitlist-table')).toBeInTheDocument()

    for (const entry of waitlist) {
      const row = screen.getByTestId(`waitlist-entry-${entry.id}`)

      expect(row).toBeInTheDocument()
      expect(
        within(row).getByText(entry.givenName, { exact: false })
      ).toBeInTheDocument()
      expect(
        within(row).getByText(entry.familyName, { exact: false })
      ).toBeInTheDocument()
      expect(
        within(row).getByText(entry.email, { exact: false })
      ).toBeInTheDocument()
      expect(
        within(row).getByText(entry.phone, { exact: false })
      ).toBeInTheDocument()
    }
  })
})
