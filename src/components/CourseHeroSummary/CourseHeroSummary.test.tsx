import { add, sub } from 'date-fns'
import React from 'react'

import { CourseDeliveryType, RoleName } from '@app/types'

import { render, screen } from '@test/index'
import {
  buildCourse,
  buildCourseSchedule,
  buildCourseTrainer,
  buildProfile,
  buildOrganization,
} from '@test/mock-data-utils'

import { CourseHeroSummary } from './CourseHeroSummary'

describe('component: CourseHeroSummary', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('displays basic course information', () => {
    const course = buildCourse()

    render(<CourseHeroSummary course={course} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    expect(screen.getByText(course.name)).toBeInTheDocument()
    expect(screen.getByText(course.course_code)).toBeInTheDocument()
  })

  it('displays a correct message if a course has began', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: sub(new Date(), { days: 2 }).toISOString(),
        end: add(new Date(), { days: 2 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    expect(screen.getByText('Course has begun.')).toBeInTheDocument()
  })

  it('displays a correct message if a course begins today', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: add(new Date(), { minutes: 5 }).toISOString(),
        end: add(new Date(), { days: 2 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    expect(screen.getByText('Course begins today.')).toBeInTheDocument()
  })

  it('displays a correct message if a course begins in 1 day', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: add(new Date(), { days: 1 }).toISOString(),
        end: add(new Date(), { days: 1 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('1 day until course begins')).toBeInTheDocument()
  })

  it('displays a correct message if a course begins in 2 days', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: add(new Date(), { days: 2 }).toISOString(),
        end: add(new Date(), { days: 2 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    expect(screen.getByText('2 days until course begins')).toBeInTheDocument()
  })

  it('displays a correct message if a course has ended', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: sub(new Date(), { days: 3 }).toISOString(),
        end: sub(new Date(), { days: 2 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    expect(screen.getByText('Course has ended.')).toBeInTheDocument()
  })

  it('displays correct course dates', () => {
    const courseStarts = new Date('2022-05-12T06:30:00')
    const courseEnds = new Date('2022-05-15T07:30:00')

    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: courseStarts.toISOString(),
        end: courseEnds.toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    expect(screen.getByText('12 May 2022, 06:30 AM')).toBeInTheDocument()
    expect(screen.getByText('15 May 2022, 07:30 AM')).toBeInTheDocument()
  })

  it('displays correct trainer info if a logged in user is not a trainer', () => {
    const LOGGED_IN_USER_ID = 'current-user'

    const profile = buildProfile({
      overrides: {
        id: 'not-current-user',
        givenName: 'John',
        familyName: 'Doe',
      },
    })

    const course = buildCourse({
      overrides: { trainers: [buildCourseTrainer({ overrides: { profile } })] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: { profile: { id: LOGGED_IN_USER_ID } },
    })

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('(Lead)')).toBeInTheDocument()
  })

  it('displays correct trainer info if a logged in user is a trainer', () => {
    const LOGGED_IN_USER_ID = 'current-user'

    const profile = buildProfile({ overrides: { id: LOGGED_IN_USER_ID } })

    const course = buildCourse({
      overrides: { trainers: [buildCourseTrainer({ overrides: { profile } })] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: { profile: { id: LOGGED_IN_USER_ID } },
    })

    expect(screen.getByText('You are the trainer')).toBeInTheDocument()
  })

  it('displays course venue information', () => {
    const course = buildCourse()

    render(<CourseHeroSummary course={course} />)

    expect(
      screen.getByText(
        `${course.schedule[0].venue?.name}, ${course.schedule[0].venue?.city}`
      )
    ).toBeInTheDocument()
  })

  it('displays org information', () => {
    const course = buildCourse({
      overrides: {
        organization: buildOrganization({
          overrides: {
            name: 'London First School',
          },
        }),
      },
    })

    render(<CourseHeroSummary course={course} />)

    expect(
      screen.getByText('Hosted by London First School')
    ).toBeInTheDocument()
  })

  it('displays Virtual if course is online', () => {
    const course = buildCourse({
      overrides: {
        deliveryType: CourseDeliveryType.VIRTUAL,
      },
    })

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('Virtual')).toBeInTheDocument()
  })

  describe('Slots', () => {
    it('should render BackButton slot', () => {
      const course = buildCourse({
        overrides: {},
      })

      render(
        <CourseHeroSummary
          course={course}
          slots={{
            BackButton: () => (
              <button data-testid="back-button">Back Button</button>
            ),
          }}
        />
      )

      expect(screen.getByTestId('back-button')).toBeInTheDocument()
    })

    it('should render EditButton slot', () => {
      const course = buildCourse({
        overrides: {},
      })

      render(
        <CourseHeroSummary
          course={course}
          slots={{
            EditButton: () => (
              <button data-testid="edit-button">Edit Button</button>
            ),
          }}
        />
      )

      expect(screen.getByTestId('edit-button')).toBeInTheDocument()
    })

    it('should render OrderItem slot', () => {
      const course = buildCourse({
        overrides: {},
      })

      render(
        <CourseHeroSummary
          course={course}
          slots={{
            OrderItem: () => <div>Order: TT-123</div>,
          }}
        />
      )

      expect(screen.getByTestId('order-item')).toBeInTheDocument()
    })
  })
})
