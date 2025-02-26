/* eslint-disable playwright/no-skipped-test */
import { test as base } from '@playwright/test'

import {
  Course_Delivery_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import * as API from '@qa/api'
import { closedCourseSteps } from '@qa/course-test-steps'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

let courseIDToDelete: number
allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `closed L1 F2F reaccred non blended as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.reaccreditation = true
        course.go1Integration = false
        return course
      })(),
    },
    {
      name: `closed L1 F2F non-reaccred blended as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.go1Integration = true
        return course
      })(),
    },
    {
      name: `closed L1 F2F non-reaccred non blended as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.go1Integration = false
        return course
      })(),
    },
    {
      name: `closed L1 Virtual reaccred non blended as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.reaccreditation = true
        course.go1Integration = false
        course.deliveryType = Course_Delivery_Type_Enum.Virtual
        return course
      })(),
    },
    {
      name: `closed L1 Virtual non-reaccred blended as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.go1Integration = true
        course.deliveryType = Course_Delivery_Type_Enum.Virtual
        return course
      })(),
    },
    {
      name: `closed Virtual F2F non-reaccred non blended as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.go1Integration = false
        course.deliveryType = Course_Delivery_Type_Enum.Virtual
        return course
      })(),
    },
    {
      name: `closed L1 Mixed reaccred non blended as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.reaccreditation = true
        course.go1Integration = false
        course.deliveryType = Course_Delivery_Type_Enum.Mixed
        return course
      })(),
    },
    {
      name: `closed L1 Mixed non-reaccred non blended as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.go1Integration = false
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
          organization: { name: 'London First School' },
          bookingContactProfile: users.userOrgAdmin,
          freeSpaces: 1,
          max_participants: 13,
          freeCourseMaterials: 8,
          salesRepresentative: users.salesAdmin,
        })
      },
    })

    test.afterEach(async () => {
      await API.course.deleteCourse(courseIDToDelete)
    })

    // eslint-disable-next-line playwright/expect-expect, playwright/no-focused-test
    test(`create course: ${data.name} ${data.smoke}`, async ({
      browser,
      course,
    }) => {
      courseIDToDelete = await closedCourseSteps(
        browser,
        course,
        data.user as StoredCredentialKey,
      )
    })
  }
})
