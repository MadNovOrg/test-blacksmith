/* eslint-disable playwright/no-skipped-test */
import { test as base } from '@playwright/test'
import { addMonths } from 'date-fns'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import * as API from '@qa/api'
import { IRELAND_TIMEZONE } from '@qa/constants'
import { closedCourseSteps } from '@qa/course-test-steps'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { StoredCredentialKey } from '@qa/util'

import { buildVenue } from '@test/mock-data-utils'

const allowdUsers = ['admin', 'ops', 'salesAdmin']

allowdUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `closed FT+ F2F reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.reaccreditation = true
        return course
      })(),
    },
    {
      name: `closed FT+ F2F non-reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        return course
      })(),
    },
    {
      name: `closed FT+ mixed reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.reaccreditation = true
        course.deliveryType = Course_Delivery_Type_Enum.Mixed
        return course
      })(),
    },
    {
      name: `closed FT+ mixed non-reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.Mixed
        return course
      })(),
    },
  ]

  for (const data of dataSet) {
    const test = base.extend<{ course: Course }>({
      course: async ({}, use) => {
        await use({
          ...data.course,
          type: Course_Type_Enum.Closed,
          level: Course_Level_Enum.FoundationTrainerPlus,
          organization: { name: 'London First School' },
          bookingContactProfile: users.userOrgAdmin,
          freeSpaces: 1,
          max_participants: 13,
          mandatoryCourseMaterials: 8,
          schedule: [
            {
              start: addMonths(new Date(new Date().setHours(8, 0)), 2),
              end: addMonths(new Date(new Date().setHours(17, 0)), 2),
              venue: buildVenue({
                overrides: { name: 'Ireland Vinayaka Temple' },
              }),
              timeZone: IRELAND_TIMEZONE,
            },
          ],
          salesRepresentative: users.salesAdmin,
        })
        await API.course.deleteCourse(data.course.id)
      },
    })

    // eslint-disable-next-line playwright/expect-expect, playwright/no-focused-test
    test(`create course: ${data.name} ${data.smoke}`, async ({
      browser,
      course,
    }) => {
      await closedCourseSteps(browser, course, data.user as StoredCredentialKey)
    })
  }
})
