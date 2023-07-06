import { getByTestId } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import React from 'react'

import useCourse from '@app/hooks/useCourse'
import useCourseInvites from '@app/hooks/useCourseInvites'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { useWaitlist } from '@app/hooks/useWaitlist'
import { buildOrder } from '@app/pages/tt-pages/OrderDetails/mock-utils'
import {
  Course,
  CourseInvite,
  CourseParticipant,
  CourseType,
  RoleName,
} from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen, within } from '@test/index'
import {
  buildCourse,
  buildInvite,
  buildParticipant,
  buildWaitlistEntry,
} from '@test/mock-data-utils'

import { CourseAttendees } from '.'

jest.mock('@app/hooks/useCourse')
jest.mock('@app/hooks/useWaitlist')
jest.mock('@app/hooks/useCourseInvites')
jest.mock('@app/hooks/useCourseParticipants')

const useCourseMock = useCourse as jest.MockedFunction<typeof useCourse>
const useWaitlistMock = useWaitlist as jest.MockedFunction<typeof useWaitlist>
const useCourseInvitesMock = useCourseInvites as jest.MockedFunction<
  typeof useCourseInvites
>
const useCourseParticipantsMock = useCourseParticipants as jest.MockedFunction<
  typeof useCourseParticipants
>

const emptyWaitlistResponse = {
  data: [],
  total: 0,
  error: undefined,
  isLoading: false,
}

const emptyPendingInvitesResponse = {
  data: [],
  total: 0,
  send: jest.fn(),
  error: undefined,
  resend: jest.fn(),
  cancel: jest.fn(),
  status: LoadingStatus.SUCCESS,
  invalidateCache: jest.fn(),
}

describe('component: CourseAttendees', () => {
  let course: Course

  beforeEach(() => {
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
    useCourseInvitesMock.mockReturnValue(emptyPendingInvitesResponse)

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.FETCHING,
      mutate: jest.fn(),
    })

    render(<CourseAttendees course={course} />)

    expect(
      screen.getByTestId('course-participants-fetching')
    ).toBeInTheDocument()
  })

  describe('Table', () => {
    const testData = {
      participants: [
        buildParticipant({
          overrides: {
            // @ts-expect-error Ignore missing fields
            order: buildOrder({
              overrides: {
                id: 'c2715e60-752c-41f5-b38e-b2984f8f02a3',
                xeroInvoiceNumber: 'TT-123456',
              },
            }),
          },
        }),
        buildParticipant(),
        buildParticipant(),
      ],
    }

    const setup = (role?: RoleName, courseType?: CourseType) => {
      // Arrange
      useCourseParticipantsMock.mockReturnValue({
        status: LoadingStatus.SUCCESS,
        data: testData.participants,
        total: testData.participants.length,
        mutate: jest.fn(),
      })

      useWaitlistMock.mockReturnValue(emptyWaitlistResponse)
      useCourseInvitesMock.mockReturnValue(emptyPendingInvitesResponse)

      const tableCourse = buildCourse({
        overrides: {
          type: courseType ?? CourseType.OPEN,
        },
      })

      useCourseMock.mockReturnValue({
        mutate: jest.fn(),
        status: LoadingStatus.SUCCESS,
        data: tableCourse,
      })

      // Act
      render(<CourseAttendees course={tableCourse} />, {
        auth: {
          activeRole: role ?? RoleName.USER,
        },
      })
    }
    it('should display a table if a course has participants', () => {
      setup()

      // Assert
      expect(screen.getByTestId('attending-table')).toBeInTheDocument()
    })

    it('should display rows equal with the amount of participants', async () => {
      setup()
      const { participants } = testData

      // Assert
      expect(
        (
          await screen.findAllByTestId('course-participant-row-', {
            exact: false,
            suggest: true,
          })
        )?.length
      ).toEqual(participants.length)

      participants.forEach(participant => {
        expect(
          screen.getByTestId(`course-participant-row-${participant.id}`)
        ).toBeInTheDocument()
      })
    })

    it('should display "Full Name" column in a row', () => {
      setup()
      const { participants } = testData
      const participantRow = screen.getByTestId(
        `course-participant-row-${participants[0].id}`
      )

      // Assert

      expect(
        within(participantRow).getByText(`${participants[0].profile.fullName}`)
      ).toBeInTheDocument()
    })

    it('should display "Email" column', () => {
      setup()
      const { participants } = testData
      const participantRow = screen.getByTestId(
        `course-participant-row-${participants[0].id}`
      )

      // Assert
      expect(
        within(participantRow).getByText(participants[0].profile.email)
      ).toBeInTheDocument()
    })

    it('should display "Organization" column', () => {
      setup()
      const { participants } = testData
      const participantRow = screen.getByTestId(
        `course-participant-row-${participants[0].id}`
      )

      // Assert
      expect(
        within(participantRow).getByText(
          participants[0].profile.organizations[0].organization?.name ?? ''
        )
      ).toBeInTheDocument()
    })

    it('should display "Orders" column only when the course type is OPEN', () => {
      setup(RoleName.TT_ADMIN)
      const { participants } = testData
      const participantRow = screen.getByTestId(
        `course-participant-row-${participants[0].id}`
      )

      // Assert
      expect(
        within(participantRow).getByText(
          participants[0].order?.xeroInvoiceNumber ?? ''
        )
      ).toBeInTheDocument()
    })

    it('should not display "Orders" column only when the course type is not OPEN', () => {
      setup(RoleName.TT_OPS, CourseType.CLOSED)
      const { participants } = testData
      const participantRow = screen.getByTestId(
        `course-participant-row-${participants[0].id}`
      )

      // Assert
      expect(
        within(participantRow).queryByText(
          participants[0].order?.xeroInvoiceNumber ?? ''
        )
      ).not.toBeInTheDocument()
    })

    it('should not display "Orders" column only when active role does not allow', () => {
      setup()
      const { participants } = testData
      const participantRow = screen.getByTestId(
        `course-participant-row-${participants[0].id}`
      )

      // Assert
      expect(
        within(participantRow).queryByText(
          participants[0].order?.xeroInvoiceNumber ?? ''
        )
      ).not.toBeInTheDocument()
    })
  })

  it('displays a message if no one has registered yet', () => {
    const participants: CourseParticipant[] = []

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      total: participants.length,
      mutate: jest.fn(),
    })

    useWaitlistMock.mockReturnValue(emptyWaitlistResponse)
    useCourseInvitesMock.mockReturnValue(emptyPendingInvitesResponse)

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

  it('paginates course participants', async () => {
    const PER_PAGE = 12

    const participants = new Array(PER_PAGE).map(() => buildParticipant())

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      total: 15,
      mutate: jest.fn(),
    })

    useWaitlistMock.mockReturnValue(emptyWaitlistResponse)
    useCourseInvitesMock.mockReturnValue(emptyPendingInvitesResponse)

    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      status: LoadingStatus.SUCCESS,
      data: course,
    })

    render(<CourseAttendees course={course} />)

    useCourseParticipantsMock.mockClear()

    await userEvent.click(screen.getByTitle('Go to next page'))

    expect(useCourseParticipantsMock).toHaveBeenCalledTimes(1)
    expect(useCourseParticipantsMock.mock.calls[0]).toEqual([
      course.id,
      {
        alwaysShowArchived: true,
        order: 'asc',
        pagination: {
          limit: PER_PAGE,
          offset: PER_PAGE,
        },
        sortBy: 'name',
      },
    ])
  })

  it('sorts descending by participants name', async () => {
    const PER_PAGE = 12

    const participants = new Array(PER_PAGE).map(() => buildParticipant())

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      total: 15,
      mutate: jest.fn(),
    })

    useWaitlistMock.mockReturnValue(emptyWaitlistResponse)
    useCourseInvitesMock.mockReturnValue(emptyPendingInvitesResponse)

    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      status: LoadingStatus.SUCCESS,
      data: course,
    })

    render(<CourseAttendees course={course} />)

    useCourseParticipantsMock.mockClear()

    await userEvent.click(screen.getByText('Name'))

    expect(useCourseParticipantsMock).toHaveBeenCalledTimes(1)
    expect(useCourseParticipantsMock.mock.calls[0]).toEqual([
      course.id,
      {
        alwaysShowArchived: true,
        order: 'desc',
        pagination: {
          limit: PER_PAGE,
          offset: 0,
        },
        sortBy: 'name',
      },
    ])
  })

  it('displays course waitlist', async () => {
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

    useCourseInvitesMock.mockReturnValue(emptyPendingInvitesResponse)

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: participants,
      total: 3,
      mutate: jest.fn(),
    })

    useWaitlistMock.mockReturnValue({
      data: waitlist,
      isLoading: false,
      total: waitlist.length,
      error: undefined,
    })

    const openCourse = buildCourse()
    openCourse.type = CourseType.OPEN

    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      status: LoadingStatus.SUCCESS,
      data: openCourse,
    })

    render(<CourseAttendees course={openCourse} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    useCourseParticipantsMock.mockClear()
    useWaitlistMock.mockClear()

    await userEvent.click(screen.getByText('Waitlist (3)'))

    expect(useWaitlistMock).toHaveBeenCalledTimes(2)
    expect(useWaitlistMock.mock.calls[0]).toMatchObject([
      {
        courseId: 0,
        sort: { by: 'createdAt', dir: 'asc' },
      },
    ])
    expect(useWaitlistMock.mock.calls[1]).toMatchObject([
      {
        courseId: openCourse.id,
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

  it('displays waitlist tab for sales admin user', () => {
    useCourseInvitesMock.mockReturnValue(emptyPendingInvitesResponse)

    useCourseParticipantsMock.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: [],
      total: 0,
      mutate: jest.fn(),
    })

    useWaitlistMock.mockReturnValue({
      data: [],
      isLoading: false,
      total: 0,
      error: undefined,
    })

    const openCourse = buildCourse()
    openCourse.type = CourseType.OPEN

    useCourseMock.mockReturnValue({
      mutate: jest.fn(),
      status: LoadingStatus.SUCCESS,
      data: openCourse,
    })

    render(<CourseAttendees course={openCourse} />, {
      auth: { activeRole: RoleName.SALES_ADMIN },
    })

    expect(screen.getByRole('tab', { name: /waitlist/i })).toBeInTheDocument()
  })

  describe('pending invites', () => {
    beforeEach(() => {
      useWaitlistMock.mockReturnValue(emptyWaitlistResponse)
      useCourseInvitesMock.mockReturnValue(emptyPendingInvitesResponse)
      useCourseParticipantsMock.mockReturnValue({
        status: LoadingStatus.SUCCESS,
        data: [],
        total: 0,
        mutate: jest.fn(),
      })
      useCourseMock.mockReturnValue({
        mutate: jest.fn(),
        status: LoadingStatus.SUCCESS,
        data: course,
      })
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('shows no invites pending message if list is empty', async () => {
      render(<CourseAttendees course={course} />)

      await userEvent.click(screen.getByText('Pending (0)', { exact: false }))

      expect(useCourseInvitesMock).toHaveBeenCalledTimes(7)
      expect(useCourseInvitesMock.mock.calls[6]).toMatchObject([
        course.id,
        'PENDING',
        'asc',
        12,
        0,
      ])
      expect(screen.getByText('No invites pending')).toBeVisible()
    })

    it('shows table with entries, if any', async () => {
      const invites: CourseInvite[] = [
        buildInvite(),
        buildInvite(),
        buildInvite(),
      ]

      useCourseInvitesMock.mockReturnValue({
        ...emptyPendingInvitesResponse,
        data: invites,
        total: 3,
      })

      render(<CourseAttendees course={course} />, {
        auth: { activeRole: RoleName.TT_ADMIN },
      })

      await userEvent.click(screen.getByText('Pending (3)', { exact: false }))

      expect(useCourseInvitesMock).toHaveBeenCalledTimes(7)
      expect(useCourseInvitesMock.mock.calls[6]).toMatchObject([
        course.id,
        'PENDING',
        'asc',
        12,
        0,
      ])

      const table = screen.getByTestId('invites-table')
      expect(table).toBeVisible()

      const invite = invites[0]

      const resendButton = getByTestId(
        table,
        `course-resend-invite-btn-${invite.id}`
      )
      expect(resendButton).toBeVisible()
      await userEvent.click(resendButton)

      expect(emptyPendingInvitesResponse.resend).toHaveBeenCalledTimes(1)
      expect(emptyPendingInvitesResponse.resend.mock.calls[0]).toMatchObject([
        invite,
      ])

      const deleteButton = getByTestId(
        table,
        `course-cancel-invite-btn-${invite.id}`
      )
      expect(deleteButton).toBeVisible()

      await userEvent.click(deleteButton)

      expect(emptyPendingInvitesResponse.cancel).toHaveBeenCalledTimes(1)
      expect(emptyPendingInvitesResponse.cancel.mock.calls[0]).toMatchObject([
        invite,
      ])
    })
  })
})
