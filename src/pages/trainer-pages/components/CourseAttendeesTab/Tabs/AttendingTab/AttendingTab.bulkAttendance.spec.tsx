import { subDays } from 'date-fns'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import {
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  Grade_Enum,
} from '@app/generated/graphql'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { chance, render, screen, userEvent, within } from '@test/index'
import {
  buildCourse,
  buildCourseSchedule,
  buildCourseTrainer,
  buildParticipant,
  buildProfile,
} from '@test/mock-data-utils'

import { AttendingTab } from './AttendingTab'

vi.mock('@app/hooks/useCourseParticipants')
const useCourseParticipantsMocked = vi.mocked(useCourseParticipants)

;[RoleName.TT_ADMIN, RoleName.TT_OPS].forEach(role => {
  it(`displays the mark attendance button if a user is ${role}`, () => {
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
      { auth: { activeRole: role } }
    )

    expect(
      screen.getByRole('button', { name: /mark attendance/i })
    ).toBeInTheDocument()
  })
})

it('displays the mark attendance button if user is a lead trainer on the course', () => {
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
    }
  )

  expect(
    screen.getByRole('button', { name: /mark attendance/i })
  ).toBeInTheDocument()
})

it('displays the mark attendance button if user is an assist trainer on the course', () => {
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
    }
  )

  expect(
    screen.getByRole('button', { name: /mark attendance/i })
  ).toBeInTheDocument()
})

it("doesn't display the mark attendance button if user is a moderator on the course", () => {
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
    }
  )

  expect(
    within(screen.getByRole('table')).queryByText(/attendance/i)
  ).not.toBeInTheDocument()

  expect(
    screen.queryByRole('button', { name: /mark attendance/i })
  ).not.toBeInTheDocument()
})

it('displays the mark attendance button if course has ended', () => {
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
    }
  )

  expect(
    screen.getByRole('button', { name: /mark attendance/i })
  ).toBeInTheDocument()
})

it('marks the mark attendance button disabled if course ended and course status is not grade missing', () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

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

  const gradedParticipant = buildParticipant({
    overrides: { grade: Grade_Enum.Pass },
  })

  const participants = [gradedParticipant]

  useCourseParticipantsMocked.mockReturnValue({
    status: LoadingStatus.SUCCESS,
    data: participants,
    mutate: vi.fn(),
  })

  render(
    <Provider value={client}>
      <AttendingTab
        updateAttendeesHandler={vitest.fn()}
        onSendingCourseInformation={vitest.fn()}
        course={course}
      />
    </Provider>,
    { auth: { activeRole: RoleName.TT_ADMIN } }
  )

  expect(
    screen.getByRole('button', { name: /mark attendance/i })
  ).toBeDisabled()
})

it('toggles selected participant when main checkbox is clicked', async () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  const course = buildCourse({
    overrides: {
      schedule: [
        buildCourseSchedule({
          overrides: { start: new Date().toISOString() },
        }),
      ],
    },
  })

  const participants = [buildParticipant(), buildParticipant()]

  useCourseParticipantsMocked.mockReturnValue({
    status: LoadingStatus.SUCCESS,
    data: participants,
    mutate: vi.fn(),
  })

  render(
    <Provider value={client}>
      <AttendingTab
        updateAttendeesHandler={vitest.fn()}
        onSendingCourseInformation={vitest.fn()}
        course={course}
      />
    </Provider>
  )

  const mainCheckbox = screen.getByTestId('TableChecks-Head')

  await userEvent.click(mainCheckbox)

  expect(mainCheckbox).toBeChecked()

  participants.forEach(p => {
    expect(
      within(screen.getByTestId(`course-participant-row-${p.id}`)).getByTestId(
        'TableChecks-Row'
      )
    ).toBeChecked()
  })

  await userEvent.click(mainCheckbox)

  expect(mainCheckbox).not.toBeChecked()

  participants.forEach(p => {
    expect(
      within(screen.getByTestId(`course-participant-row-${p.id}`)).getByTestId(
        'TableChecks-Row'
      )
    ).not.toBeChecked()
  })
})

it('toggles the main checkbox as indeterminate when some participants are toggled', async () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  const course = buildCourse({
    overrides: {
      schedule: [
        buildCourseSchedule({
          overrides: { start: new Date().toISOString() },
        }),
      ],
    },
  })

  const participants = [buildParticipant(), buildParticipant()]

  useCourseParticipantsMocked.mockReturnValue({
    status: LoadingStatus.SUCCESS,
    data: participants,
    mutate: vi.fn(),
  })

  render(
    <Provider value={client}>
      <AttendingTab
        updateAttendeesHandler={vitest.fn()}
        onSendingCourseInformation={vitest.fn()}
        course={course}
      />
    </Provider>
  )

  await userEvent.click(
    within(
      screen.getByTestId(`course-participant-row-${participants[0].id}`)
    ).getByTestId('TableChecks-Row')
  )

  expect(screen.getByTestId('TableChecks-Head')).toHaveAttribute(
    'data-indeterminate',
    'true'
  )
})

it("disables participant's checkbox when participant has been graded", () => {
  const client = {
    executeMutation: () => never,
  } as unknown as Client

  const course = buildCourse({
    overrides: {
      schedule: [
        buildCourseSchedule({
          overrides: { start: new Date().toISOString() },
        }),
      ],
    },
  })

  const gradedParticipant = buildParticipant({
    overrides: { grade: Grade_Enum.Pass },
  })

  const participants = [gradedParticipant]

  useCourseParticipantsMocked.mockReturnValue({
    status: LoadingStatus.SUCCESS,
    data: participants,
    mutate: vi.fn(),
  })

  render(
    <Provider value={client}>
      <AttendingTab
        updateAttendeesHandler={vitest.fn()}
        onSendingCourseInformation={vitest.fn()}
        course={course}
      />
    </Provider>
  )

  expect(
    within(
      screen.getByTestId(`course-participant-row-${gradedParticipant.id}`)
    ).getByTestId('TableChecks-Row')
  ).toBeDisabled()
})
