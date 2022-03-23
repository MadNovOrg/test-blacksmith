import React from 'react'
import { add, format, sub } from 'date-fns'
import useSWR from 'swr'

import { CourseHeroSummary } from '.'

import { buildCourse, buildCourseSchedule } from '@test/mock-data-utils'
import { render, screen } from '@test/index'

jest.mock('swr')
const useSWRMock = jest.mocked(useSWR)
const useSWRMockDefaults = {
  data: undefined,
  mutate: jest.fn(),
  isValidating: false,
}

describe('component: CourseHeroSummary', () => {
  it('displays basic course information', () => {
    const course = buildCourse()
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { course },
    })

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText(course.name)).toBeInTheDocument()
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
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { course },
    })

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('Course has began.'))
  })

  it('displays a correct message if a course begins today', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: add(new Date(), { hours: 2 }).toISOString(),
        end: add(new Date(), { days: 2 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { course },
    })

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('Course begins today.')).toBeInTheDocument()
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
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { course },
    })

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('Course has ended.')).toBeInTheDocument()
  })

  it('displays correct course dates', () => {
    const courseStarts = add(new Date(), { days: 3 })
    const courseEnds = add(new Date(), { days: 5 })

    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: courseStarts.toISOString(),
        end: courseEnds.toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { course },
    })

    render(<CourseHeroSummary course={course} />)

    expect(
      screen.getByText(`${format(courseStarts, 'd MMMM yyyy, HH:mma')}`)
    ).toBeInTheDocument()
    expect(
      screen.getByText(`${format(courseEnds, 'd MMMM yyyy, HH:mma')}`)
    ).toBeInTheDocument()
  })

  it('displays correct trainer info if a logged in user is not a trainer', () => {
    const LOGGED_IN_USER_ID = 'current-user'

    const course = buildCourse({
      overrides: {
        trainer: {
          id: 'not-current-user',
          fullName: 'John Doe',
        },
      },
    })
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { course },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: { profile: { id: LOGGED_IN_USER_ID } },
    })

    expect(screen.getByText('Hosted by John Doe')).toBeInTheDocument()
  })

  it('displays correct trainer info if a logged in user is a trainer', () => {
    const LOGGED_IN_USER_ID = 'current-user'

    const course = buildCourse({
      overrides: {
        trainer: {
          id: LOGGED_IN_USER_ID,
        },
      },
    })
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { course },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: { profile: { id: LOGGED_IN_USER_ID } },
    })

    expect(screen.getByText('You are the trainer')).toBeInTheDocument()
  })

  it('displays course venue information', () => {
    const course = buildCourse()
    useSWRMock.mockReturnValue({
      ...useSWRMockDefaults,
      data: { course },
    })

    render(<CourseHeroSummary course={course} />)

    expect(
      screen.getByText(
        `${course.schedule[0].venue?.name}, ${course.schedule[0].venue?.address.city}`
      )
    ).toBeInTheDocument()
  })
})
