import { add, addWeeks, sub } from 'date-fns'
import { saveAs } from 'file-saver'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  Course_Type_Enum,
  ExportBlendedLearningCourseDataQuery,
} from '@app/generated/graphql'
import useCourseInvites from '@app/hooks/useCourseInvites'
import { Course, InviteStatus, RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { chance, render, screen, userEvent, waitForCalls } from '@test/index'
import {
  buildBlExportData,
  buildCourse,
  buildCourseSchedule,
  buildInvite,
  buildProfile,
} from '@test/mock-data-utils'
import { profile } from '@test/providers'

import { CourseInvites } from './CourseInvites'

vi.mock('@app/hooks/useCourseInvites')
const useCourseInvitesMock = vi.mocked(useCourseInvites)

vi.mock('file-saver', () => ({ saveAs: () => vi.fn() }))

const useCourseInvitesDefaults = {
  data: [],
  total: 0,
  status: LoadingStatus.FETCHING,
  error: undefined,
  send: vi.fn(),
  resend: vi.fn(),
  cancel: vi.fn(),
  invalidateCache: vi.fn(),
}

vi.mock('file-saver', () => ({ saveAs: vi.fn() }))

const urqlMockClient = {
  executeQuery: () =>
    fromValue<{ data: ExportBlendedLearningCourseDataQuery }>(
      buildBlExportData()
    ),
} as never as Client

describe(CourseInvites.name, () => {
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

  it('does render after course started but not ended', async () => {
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
    expect(screen.queryByTestId('course-invite-btn')).toBeInTheDocument()
  })

  it('does not render after course ended', async () => {
    course = buildCourse({
      overrides: {
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: sub(new Date(), { days: -4 }).toISOString(),
              end: add(new Date(), { days: -2 }).toISOString(),
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
        type: Course_Type_Enum.Open,
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
        type: Course_Type_Enum.Closed,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: addWeeks(new Date(), 5).toISOString(),
              end: addWeeks(new Date(), 6).toISOString(),
            },
          }),
        ],
      },
    })

    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: { activeRole: RoleName.TRAINER },
    })

    expect(screen.queryByTestId('course-invite-btn')).not.toBeInTheDocument()
  })

  it("doesn't display the invite attendees button for booking contact from different course", () => {
    const course = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: addWeeks(new Date(), 5).toISOString(),
              end: addWeeks(new Date(), 6).toISOString(),
            },
          }),
        ],
      },
    })

    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: {
        activeRole: RoleName.TRAINER,
        allowedRoles: new Set([RoleName.TRAINER, RoleName.BOOKING_CONTACT]),
      },
    })

    expect(screen.queryByTestId('course-invite-btn')).not.toBeInTheDocument()
  })

  it('display the invite attendees button for booking contact of the course', () => {
    const course = buildCourse({
      overrides: {
        type: Course_Type_Enum.Closed,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: addWeeks(new Date(), 5).toISOString(),
              end: addWeeks(new Date(), 6).toISOString(),
            },
          }),
        ],
        bookingContact: buildProfile({
          overrides: {
            id: profile?.id,
          },
        }),
      },
    })

    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} />, {
      auth: {
        activeRole: RoleName.TRAINER,
        allowedRoles: new Set([RoleName.TRAINER, RoleName.BOOKING_CONTACT]),
      },
    })

    expect(screen.queryByTestId('course-invite-btn')).toBeInTheDocument()
  })

  it('should render progress export button for blended learning', () => {
    const course = buildCourse({
      overrides: {
        type: Course_Type_Enum.Indirect,
        go1Integration: true,
      },
    })

    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} attendeesCount={1} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
        allowedRoles: new Set([RoleName.TT_ADMIN]),
      },
    })

    expect(screen.queryByTestId('progress-export')).toBeInTheDocument()

    const course2 = buildCourse({
      overrides: {
        type: Course_Type_Enum.Indirect,
        go1Integration: false,
      },
    })

    render(<CourseInvites course={course2} attendeesCount={1} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
        allowedRoles: new Set([RoleName.TT_ADMIN]),
      },
    })

    expect(screen.queryByTestId('progress-export')).toBeInTheDocument()
  })

  it('should not render progress export button for non blended learning course', () => {
    const course = buildCourse({
      overrides: {
        type: Course_Type_Enum.Indirect,
        go1Integration: false,
      },
    })

    useCourseInvitesMock.mockReturnValue(useCourseInvitesDefaults)

    render(<CourseInvites course={course} attendeesCount={1} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
        allowedRoles: new Set([RoleName.TT_ADMIN]),
      },
    })

    expect(screen.queryByTestId('progress-export')).not.toBeInTheDocument()
  })

  it('should not render progress export button if number of attendances is 0', () => {
    const course = buildCourse({
      overrides: {
        type: Course_Type_Enum.Indirect,
        go1Integration: true,
      },
    })

    render(
      <Provider value={urqlMockClient}>
        <CourseInvites course={course} attendeesCount={0} />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
          allowedRoles: new Set([RoleName.TT_ADMIN]),
        },
      }
    )

    const exportProgressBtn = screen.queryByTestId('progress-export')
    expect(exportProgressBtn).not.toBeInTheDocument()
  })

  it('should be called saveAs on progress button clicked', async () => {
    const course = buildCourse({
      overrides: {
        type: Course_Type_Enum.Indirect,
        go1Integration: true,
      },
    })

    render(
      <Provider value={urqlMockClient}>
        <CourseInvites
          course={course}
          attendeesCount={buildBlExportData().data.attendees?.attendees.length}
        />
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
          allowedRoles: new Set([RoleName.TT_ADMIN]),
        },
      }
    )

    const exportProgressBtn = screen.getByTestId('progress-export')
    expect(exportProgressBtn).toBeInTheDocument()

    await userEvent.click(exportProgressBtn)

    expect(saveAs).toHaveBeenCalled()
  })
})
