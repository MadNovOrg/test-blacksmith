import { add } from 'date-fns'
import React from 'react'

import { Course_Status_Enum } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { render, screen } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { OrderYourWorkbookAlert } from './'

const buildCustomCourse = ({
  status,
  startDate,
}: {
  status: Course_Status_Enum
  startDate: Date
}) =>
  buildCourse({
    overrides: {
      status,
      dates: {
        aggregate: {
          start: { date: startDate.toISOString() },
          end: { date: add(startDate, { days: 1 }).toISOString() },
        },
      },
    },
  })

const ALERT_MESSAGE = 'Please click if you have not ordered your workbooks'

describe('OrderYourWorkbookAlert', () => {
  it('shows the alert if the current user is a trainer, the course is scheduled and starts in more than a week', async () => {
    const course = buildCustomCourse({
      status: Course_Status_Enum.Scheduled,
      startDate: add(new Date(), { days: 8 }),
    })

    render(<OrderYourWorkbookAlert course={course} />, {
      auth: { activeRole: RoleName.TRAINER },
    })

    const alertMessage = screen.queryByText(
      content => content === ALERT_MESSAGE
    )

    expect(alertMessage).toBeInTheDocument()
  })

  it('hides the alert if the course starts exactly a week from now', async () => {
    const course = buildCustomCourse({
      status: Course_Status_Enum.Scheduled,
      startDate: add(new Date(), { days: 7 }),
    })

    render(<OrderYourWorkbookAlert course={course} />, {
      auth: { activeRole: RoleName.TRAINER },
    })
    expect(screen.queryByText(ALERT_MESSAGE)).not.toBeInTheDocument()
  })

  it('hides the alert if the course starts in less than a week from now', async () => {
    const course = buildCustomCourse({
      status: Course_Status_Enum.Scheduled,
      startDate: add(new Date(), { days: 6 }),
    })

    render(<OrderYourWorkbookAlert course={course} />, {
      auth: { activeRole: RoleName.TRAINER },
    })

    expect(screen.queryByText(ALERT_MESSAGE)).not.toBeInTheDocument()
  })

  const rolesWithoutTrainer = Object.values(RoleName).filter(
    role => role !== RoleName.TRAINER
  )
  rolesWithoutTrainer.forEach(role => {
    it(`hides the alert if the current user role is "${role}"`, async () => {
      const course = buildCustomCourse({
        status: Course_Status_Enum.Scheduled,
        startDate: add(new Date(), { months: 6 }),
      })

      render(<OrderYourWorkbookAlert course={course} />, {
        auth: { activeRole: role },
      })

      expect(screen.queryByText(ALERT_MESSAGE)).not.toBeInTheDocument()
    })
  })

  const courseStatusWithoutScheduled = Object.values(Course_Status_Enum).filter(
    status => status !== Course_Status_Enum.Scheduled
  )
  courseStatusWithoutScheduled.forEach(status => {
    it(`hides the alert if the course status is "${status}"`, async () => {
      const course = buildCustomCourse({
        status,
        startDate: add(new Date(), { months: 6 }),
      })

      render(<OrderYourWorkbookAlert course={course} />, {
        auth: { activeRole: RoleName.TRAINER },
      })

      expect(screen.queryByText(ALERT_MESSAGE)).not.toBeInTheDocument()
    })
  })
})
