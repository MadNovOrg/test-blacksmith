import { test as base } from '@playwright/test'
import { addMonths } from 'date-fns'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
} from '@app/generated/graphql'

import * as API from '@qa/api'
import { openCourseSteps } from '@qa/course-test-steps'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { StoredCredentialKey } from '@qa/util'

import { buildVenue } from '@test/mock-data-utils'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `open FT+ F2F reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.reaccreditation = true
        course.deliveryType = Course_Delivery_Type_Enum.F2F
        return course
      })(),
    },
    {
      name: `open FT+ F2F non-reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.F2F
        return course
      })(),
    },
    {
      name: `open FT+ mixed reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.reaccreditation = true
        course.deliveryType = Course_Delivery_Type_Enum.Mixed
        return course
      })(),
    },
    {
      name: `open FT+ mixed non-reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
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
          level: Course_Level_Enum.FoundationTrainerPlus,
          schedule: [
            {
              start: addMonths(new Date(new Date().setHours(8, 0)), 2),
              end: addMonths(new Date(new Date().setHours(17, 0)), 2),
              venue: buildVenue({
                overrides: { name: 'Ireland Vinayaka Temple' },
              }),
            },
          ],
        })
        await API.course.deleteCourse(data.course.id)
      },
    })

    // eslint-disable-next-line playwright/expect-expect
    test(`create course: ${data.name} ${data.smoke}`, async ({
      browser,
      course,
    }) => {
      await openCourseSteps(browser, course, data.user as StoredCredentialKey)
    })
  }
})
