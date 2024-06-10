import { addDays, subDays } from 'date-fns'

import { Course_Status_Enum, Grade_Enum } from '@app/generated/graphql'

import { chance, render, screen } from '@test/index'

import { AttendeeCourse, AttendeeCourseStatus } from './AttendeeCourseStatus'

it('shows cancelled status if course was cancelled', () => {
  const course = buildAttendeeCourse({ status: Course_Status_Enum.Cancelled })

  render(<AttendeeCourseStatus course={course} />)

  expect(screen.getByText(/cancelled/i)).toBeInTheDocument()
})

it("shows not attended if a participant didn't attend the course", () => {
  const course = buildAttendeeCourse({
    participants: [
      { attended: false, healthSafetyConsent: true, grade: Grade_Enum.Fail },
    ],
    schedule: [
      {
        id: chance.guid(),
        start: subDays(new Date(), 2).toISOString(),
        end: subDays(new Date(), 1).toISOString(),
        timeZone: String(chance.timezone()),
      },
    ],
  })

  render(<AttendeeCourseStatus course={course} />)

  expect(screen.getByText(/unattended/i)).toBeInTheDocument()
})

it("shows info required if a participant didn't fill health and safety form", () => {
  const course = buildAttendeeCourse({
    participants: [{ healthSafetyConsent: false }],
    schedule: [
      {
        id: chance.guid(),
        start: addDays(new Date(), 1).toISOString(),
        end: addDays(new Date(), 1).toISOString(),
        timeZone: String(chance.timezone()),
      },
    ],
  })

  render(<AttendeeCourseStatus course={course} />)

  expect(screen.getByText(/info required/i)).toBeInTheDocument()
})

it("shows evaluation missing if course has ended and a participant didn't evaluate the course", () => {
  const course = buildAttendeeCourse({
    participants: [
      { attended: true, healthSafetyConsent: true, grade: Grade_Enum.Pass },
    ],
    evaluation_answers_aggregate: {
      aggregate: {
        count: 0,
      },
    },
    schedule: [
      {
        id: chance.guid(),
        start: subDays(new Date(), 2).toISOString(),
        end: subDays(new Date(), 1).toISOString(),
        timeZone: String(chance.timezone()),
      },
    ],
  })

  render(<AttendeeCourseStatus course={course} />)

  expect(screen.getByText(/missing evaluation/i)).toBeInTheDocument()
})

it("shows grade missing if course has ended and participant has provided evaluation and hasn't been graded", () => {
  const course = buildAttendeeCourse({
    participants: [{ attended: true, healthSafetyConsent: true }],
    evaluation_answers_aggregate: {
      aggregate: {
        count: 5,
      },
    },
    schedule: [
      {
        id: chance.guid(),
        start: subDays(new Date(), 2).toISOString(),
        end: subDays(new Date(), 1).toISOString(),
        timeZone: String(chance.timezone()),
      },
    ],
  })

  render(<AttendeeCourseStatus course={course} />)

  expect(screen.getByText(/awaiting grade/i)).toBeInTheDocument()
})

it('shows completed if course has ended, participant evaluation the course and has been graded', () => {
  const course = buildAttendeeCourse({
    participants: [
      { attended: true, healthSafetyConsent: true, grade: Grade_Enum.Pass },
    ],
    evaluation_answers_aggregate: {
      aggregate: {
        count: 5,
      },
    },
    schedule: [
      {
        id: chance.guid(),
        start: subDays(new Date(), 2).toISOString(),
        end: subDays(new Date(), 1).toISOString(),
        timeZone: String(chance.timezone()),
      },
    ],
  })

  render(<AttendeeCourseStatus course={course} />)

  expect(screen.getByText(/completed/i)).toBeInTheDocument()
})

it("shows scheduled if course hasn't started and participant has provided health and safety info", () => {
  const course = buildAttendeeCourse({
    participants: [{ healthSafetyConsent: true }],
    evaluation_answers_aggregate: {
      aggregate: {
        count: 0,
      },
    },
    schedule: [
      {
        id: chance.guid(),
        start: addDays(new Date(), 1).toISOString(),
        end: addDays(new Date(), 1).toISOString(),
        timeZone: String(chance.timezone()),
      },
    ],
  })

  render(<AttendeeCourseStatus course={course} />)

  expect(screen.getByText(/scheduled/i)).toBeInTheDocument()
})

function buildAttendeeCourse(
  overrides?: Partial<AttendeeCourse>
): AttendeeCourse {
  return {
    status: Course_Status_Enum.Scheduled,
    evaluation_answers_aggregate: {
      aggregate: {
        count: 1,
      },
    },
    schedule: [
      {
        end: new Date().toISOString(),
        start: new Date().toISOString(),
        id: chance.guid(),
        timeZone: String(chance.timezone()),
      },
    ],
    participants: [],
    ...overrides,
  }
}
