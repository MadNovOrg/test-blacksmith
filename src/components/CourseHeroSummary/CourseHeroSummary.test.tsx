import { add, sub } from 'date-fns'
import React from 'react'

import { render, screen } from '@test/index'
import {
  buildCourse,
  buildCourseSchedule,
  buildCourseTrainer,
  buildProfile,
} from '@test/mock-data-utils'

import { CourseHeroSummary } from '.'

describe('component: CourseHeroSummary', () => {
  it('displays basic course information', () => {
    const course = buildCourse()

    render(<CourseHeroSummary course={course} />)

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

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('Course has begun.'))
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

    render(<CourseHeroSummary course={course} />)

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

    render(<CourseHeroSummary course={course} />)

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

    render(<CourseHeroSummary course={course} />)

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

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('12 May 2022, 06:30 AM')).toBeInTheDocument()
    expect(screen.getByText('15 May 2022, 07:30 AM')).toBeInTheDocument()
  })

  it('displays a correct message if course lasts 30 minutes', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: add(new Date(), { minutes: 0 }).toISOString(),
        end: add(new Date(), { minutes: 30 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('Duration 30 minutes')).toBeInTheDocument()
  })

  it('displays a correct message if course lasts 1 hour', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: add(new Date(), { minutes: 0 }).toISOString(),
        end: add(new Date(), { hours: 1 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('Duration 1 hour')).toBeInTheDocument()
  })

  it('displays a correct message if course lasts 2 hours', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: add(new Date(), { minutes: 0 }).toISOString(),
        end: add(new Date(), { hours: 2 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('Duration 2 hours')).toBeInTheDocument()
  })

  it('displays a correct message if course lasts 2 days', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: add(new Date(), { minutes: 0 }).toISOString(),
        end: add(new Date(), { days: 1 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('Duration 2 days')).toBeInTheDocument()
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

    expect(screen.getByText('Hosted by John Doe')).toBeInTheDocument()
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

  it('displays zoom link if a course has virtual element', () => {
    const ZOOM_MEETING = 'https://zoom.us/j/123456789'

    const course = buildCourse({
      overrides: {
        schedule: [
          buildCourseSchedule({
            overrides: {
              virtualLink: ZOOM_MEETING,
            },
          }),
        ],
      },
    })

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('Join via Zoom')).toBeInTheDocument()
  })
})
