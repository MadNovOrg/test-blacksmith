import React from 'react'
import userEvent from '@testing-library/user-event'

import useCourse from '@app/hooks/useCourse'
import useCourseParticipants from '@app/hooks/useCourseParticipants'

import { CourseAttendees } from '.'

import { render, screen, within } from '@test/index'
import { LoadingStatus } from '@app/util'
import { buildCourse, buildParticipant } from '@test/mock-data-utils'
import { Course, CourseParticipant } from '@app/types'

jest.mock('@app/hooks/useCourse')
jest.mock('@app/hooks/useCourseParticipants')

const useCourseMock = useCourse as jest.MockedFunction<typeof useCourse>
const useCourseParticipantsMock = useCourseParticipants as jest.MockedFunction<
  typeof useCourseParticipants
>

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
      within(noAttendeesMesage).getByText(
        'Attendees will appear here once fully registered'
      )
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
})
