import { subDays } from 'date-fns'

import {
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Grade_Enum,
} from '@app/generated/graphql'
import useCourseParticipants from '@app/modules/course_details/hooks/course-participant/useCourseParticipants'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { chance, render, screen, within } from '@test/index'
import {
  buildCourse,
  buildCourseSchedule,
  buildCourseTrainer,
  buildParticipant,
  buildProfile,
} from '@test/mock-data-utils'

import { AttendingTab } from './AttendingTab'

vi.mock(
  '@app/modules/course_details/hooks/course-participant/useCourseParticipants',
)
const useCourseParticipantsMocked = vi.mocked(useCourseParticipants)

it.each([RoleName.TT_ADMIN, RoleName.TT_OPS])(
  `displays the attendance column if a user is %s`,
  role => {
    const course = buildCourse({
      overrides: {
        schedule: [
          buildCourseSchedule({
            overrides: { start: new Date().toISOString() },
          }),
        ],
      },
    })

    const participant = buildParticipant()

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: [participant],
      mutate: vi.fn(),
    })

    render(
      <AttendingTab
        updateAttendeesHandler={vitest.fn()}
        onSendingCourseInformation={vitest.fn()}
        course={course}
      />,
      { auth: { activeRole: role } },
    )

    expect(
      within(screen.getByRole('table')).getByText('Attendance'),
    ).toBeInTheDocument()
  },
)

it('displays the attendance column if user is a lead trainer on the course', () => {
  const trainerProfileId = chance.guid()
  const course = buildCourse({
    overrides: {
      trainers: [
        buildCourseTrainer({
          overrides: {
            type: Course_Trainer_Type_Enum.Leader,
            profile: buildProfile({ overrides: { id: trainerProfileId } }),
          },
        }),
      ],
      schedule: [
        buildCourseSchedule({
          overrides: { start: new Date().toISOString() },
        }),
      ],
    },
  })

  const participant = buildParticipant()

  useCourseParticipantsMocked.mockReturnValue({
    status: LoadingStatus.SUCCESS,
    data: [participant],
    mutate: vi.fn(),
  })

  render(
    <AttendingTab
      updateAttendeesHandler={vitest.fn()}
      onSendingCourseInformation={vitest.fn()}
      course={course}
    />,
    {
      auth: { activeRole: RoleName.TRAINER, profile: { id: trainerProfileId } },
    },
  )

  expect(
    within(screen.getByRole('table')).getByText('Attendance'),
  ).toBeInTheDocument()
})

it('displays the attendance column if user is an assist trainer on the course', () => {
  const trainerProfileId = chance.guid()
  const course = buildCourse({
    overrides: {
      trainers: [
        buildCourseTrainer({
          overrides: {
            type: Course_Trainer_Type_Enum.Assistant,
            profile: buildProfile({ overrides: { id: trainerProfileId } }),
          },
        }),
      ],
      schedule: [
        buildCourseSchedule({
          overrides: { start: new Date().toISOString() },
        }),
      ],
    },
  })

  const participant = buildParticipant()

  useCourseParticipantsMocked.mockReturnValue({
    status: LoadingStatus.SUCCESS,
    data: [participant],
    mutate: vi.fn(),
  })

  render(
    <AttendingTab
      updateAttendeesHandler={vitest.fn()}
      onSendingCourseInformation={vitest.fn()}
      course={course}
    />,
    {
      auth: { activeRole: RoleName.TRAINER, profile: { id: trainerProfileId } },
    },
  )

  expect(
    within(screen.getByRole('table')).getByText('Attendance'),
  ).toBeInTheDocument()
})

it("doesn't display the attendance column if user is a moderator on the course", () => {
  const trainerProfileId = chance.guid()
  const course = buildCourse({
    overrides: {
      trainers: [
        buildCourseTrainer({
          overrides: {
            type: Course_Trainer_Type_Enum.Moderator,
            profile: buildProfile({ overrides: { id: trainerProfileId } }),
          },
        }),
      ],
      schedule: [
        buildCourseSchedule({
          overrides: { start: new Date().toISOString() },
        }),
      ],
    },
  })

  const participant = buildParticipant()

  useCourseParticipantsMocked.mockReturnValue({
    status: LoadingStatus.SUCCESS,
    data: [participant],
    mutate: vi.fn(),
  })

  render(
    <AttendingTab
      updateAttendeesHandler={vitest.fn()}
      onSendingCourseInformation={vitest.fn()}
      course={course}
    />,
    {
      auth: { activeRole: RoleName.TRAINER, profile: { id: trainerProfileId } },
    },
  )

  expect(
    within(screen.getByRole('table')).queryByText('Attendance'),
  ).not.toBeInTheDocument()
})

it('displays the attendance column if course has ended', () => {
  const course = buildCourse({
    overrides: {
      schedule: [
        buildCourseSchedule({
          overrides: {
            start: subDays(new Date(), 2).toISOString(),
            end: subDays(new Date(), 1).toISOString(),
          },
        }),
      ],
    },
  })

  const participant = buildParticipant()

  useCourseParticipantsMocked.mockReturnValue({
    status: LoadingStatus.SUCCESS,
    data: [participant],
    mutate: vi.fn(),
  })

  render(
    <AttendingTab
      updateAttendeesHandler={vitest.fn()}
      onSendingCourseInformation={vitest.fn()}
      course={course}
    />,
    {
      auth: { activeRole: RoleName.TT_ADMIN },
    },
  )

  expect(
    within(screen.getByRole('table')).getByText('Attendance'),
  ).toBeInTheDocument()
})

it('marks attendance chip disabled if participant has been graded', () => {
  const course = buildCourse({
    overrides: {
      schedule: [
        buildCourseSchedule({
          overrides: {
            start: subDays(new Date(), 2).toISOString(),
            end: subDays(new Date(), 1).toISOString(),
          },
        }),
      ],
    },
  })

  const participant = buildParticipant({
    overrides: {
      grade: Grade_Enum.Pass,
      attended: true,
    },
  })

  useCourseParticipantsMocked.mockReturnValue({
    status: LoadingStatus.SUCCESS,
    data: [participant],
    mutate: vi.fn(),
  })

  render(
    <AttendingTab
      updateAttendeesHandler={vitest.fn()}
      onSendingCourseInformation={vitest.fn()}
      course={course}
    />,
    {
      auth: { activeRole: RoleName.TT_ADMIN },
    },
  )

  expect(
    within(
      screen.getByTestId(`course-participant-row-${participant.id}`),
    ).getByRole('button', { name: /attended/i }),
  ).toHaveAttribute('aria-disabled', 'true')
})

it('marks attendance chip disabled if participant did not attend, course ended and all attended participants are graded', () => {
  const course = buildCourse({
    overrides: {
      status: Course_Status_Enum.EvaluationMissing,
      schedule: [
        buildCourseSchedule({
          overrides: {
            start: subDays(new Date(), 2).toISOString(),
            end: subDays(new Date(), 1).toISOString(),
          },
        }),
      ],
    },
  })

  const participant = buildParticipant({
    overrides: {
      grade: Grade_Enum.Pass,
      attended: false,
    },
  })

  useCourseParticipantsMocked.mockReturnValue({
    status: LoadingStatus.SUCCESS,
    data: [participant],
    mutate: vi.fn(),
  })

  render(
    <AttendingTab
      updateAttendeesHandler={vitest.fn()}
      onSendingCourseInformation={vitest.fn()}
      course={course}
    />,
    {
      auth: { activeRole: RoleName.TT_ADMIN },
    },
  )

  expect(
    within(
      screen.getByTestId(`course-participant-row-${participant.id}`),
    ).getByRole('button', { name: /did not attend/i }),
  ).toHaveAttribute('aria-disabled', 'true')
})

// https://behaviourhub.atlassian.net/browse/TTHP-3586
it.each([
  Course_Status_Enum.Cancelled,
  Course_Status_Enum.Declined,
  Course_Status_Enum.Draft,
])(
  'marks attendance chip and checkbox disabled if course status is %s',
  courseStatus => {
    const course = buildCourse({
      overrides: {
        status: courseStatus,
        schedule: [
          buildCourseSchedule({
            overrides: {
              start: subDays(new Date(), 2).toISOString(),
              end: subDays(new Date(), 1).toISOString(),
            },
          }),
        ],
      },
    })

    const participant = buildParticipant({
      overrides: {
        grade: Grade_Enum.Pass,
        attended: false,
      },
    })

    useCourseParticipantsMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: [participant],
      mutate: vi.fn(),
    })

    render(
      <AttendingTab
        updateAttendeesHandler={vitest.fn()}
        onSendingCourseInformation={vitest.fn()}
        course={course}
      />,
      {
        auth: { activeRole: RoleName.TT_ADMIN },
      },
    )

    expect(
      within(
        screen.getByTestId(`course-participant-row-${participant.id}`),
      ).getByRole('button', { name: /did not attend/i }),
    ).toHaveAttribute('aria-disabled', 'true')
  },
)
