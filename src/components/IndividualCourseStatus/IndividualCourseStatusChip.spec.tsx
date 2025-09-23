import { subDays } from 'date-fns'

import {
  CourseStatusDetails,
  IndividualCourseStatusChip,
} from '@app/components/IndividualCourseStatus/index'
import { Course_Status_Enum as CourseStatuses } from '@app/generated/graphql'

import { chance, _render, screen } from '@test/index'

const buildCourseForIndividualStatusChip = (
  overrides?: Partial<CourseStatusDetails>,
): CourseStatusDetails => ({
  cancellationRequest: null,
  schedule: [
    {
      end: new Date().toISOString(),
      start: new Date().toISOString(),
      id: chance.guid(),
      timeZone: String(chance.timezone()),
    },
  ],
  status: CourseStatuses.Scheduled,

  ...overrides,
})

const statusesExceptCancelledAndDeclined = Object.keys(CourseStatuses)
  .filter(
    el =>
      ![CourseStatuses.Cancelled, CourseStatuses.Declined].includes(
        el as CourseStatuses,
      ),
  )
  .map(el => [el])

test.each([[CourseStatuses.Cancelled], [CourseStatuses.Declined]])(
  'shows cancelled status if course was cancelled or declined',
  status => {
    const course = buildCourseForIndividualStatusChip({ status })

    _render(<IndividualCourseStatusChip course={course} participants={[]} />)

    expect(screen.getByText(/Cancelled/i)).toBeInTheDocument()
  },
)

test.each(statusesExceptCancelledAndDeclined)(
  'shows cancellation requested status if course request the cancellation',
  status => {
    const course = buildCourseForIndividualStatusChip({
      cancellationRequest: { id: 'id' },
      status: status as CourseStatuses,
    })

    _render(<IndividualCourseStatusChip course={course} participants={[]} />)

    expect(screen.getByText(/Cancellation requested/i)).toBeInTheDocument()
  },
)

it('shows completed status if course has missing evaluation', () => {
  const course = buildCourseForIndividualStatusChip({
    status: CourseStatuses.EvaluationMissing,
  })

  _render(<IndividualCourseStatusChip course={course} participants={[]} />)

  expect(screen.getByText(/Completed/i)).toBeInTheDocument()
})

it('shows awaiting grade status if course has missing graduation', () => {
  const course = buildCourseForIndividualStatusChip({
    status: CourseStatuses.GradeMissing,
    schedule: [
      {
        id: chance.guid(),
        start: subDays(new Date(), 2).toISOString(),
        end: subDays(new Date(), 1).toISOString(),
        timeZone: String(chance.timezone()),
      },
    ],
  })

  _render(
    <IndividualCourseStatusChip
      course={course}
      participants={[{ grade: null, healthSafetyConsent: true }]}
    />,
  )

  expect(screen.getByText(/Awaiting grade/i)).toBeInTheDocument()
})
