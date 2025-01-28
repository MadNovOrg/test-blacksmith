import { test as base } from '@playwright/test'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import * as API from '@qa/api'
import { isUK } from '@qa/constants'
import { closedCourseSteps } from '@qa/course-test-steps'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { users } from '@qa/data/users'
import { Accreditors_Enum } from '@qa/generated/graphql'
import { StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `closed BILD certified F2F non-blended non-reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.F2F
        course.go1Integration = false
        return course
      })(),
    },
    {
      name: `closed BILD certified F2F blended non-reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.F2F
        course.go1Integration = true
        return course
      })(),
    },
    {
      name: `closed BILD certified F2F non-blended reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.F2F
        course.go1Integration = false
        course.reaccreditation = true
        return course
      })(),
    },
    {
      name: `closed BILD certified Mixed non-blended non-reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.Mixed
        course.go1Integration = false
        return course
      })(),
    },
    {
      name: `closed BILD certified Mixed blended non-reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.Mixed
        course.go1Integration = true
        return course
      })(),
    },
    {
      name: `closed BILD certified Mixed non-blended reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.Mixed
        course.go1Integration = false
        course.reaccreditation = true
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
          level: Course_Level_Enum.BildRegular,
          accreditedBy: Accreditors_Enum.Bild,
          freeSpaces: 1,
          freeCourseMaterials: 10,
          salesRepresentative: users.salesAdmin,
        })
        await API.course.deleteCourse(data.course.id)
      },
    })
    test.describe('We only have Bild courses on uk', () => {
      if (!isUK()) {
        // eslint-disable-next-line playwright/no-skipped-test
        test.skip()
      } else {
        // eslint-disable-next-line playwright/expect-expect
        test(`create course: ${data.name} ${data.smoke}`, async ({
          browser,
          course,
        }) => {
          await closedCourseSteps(
            browser,
            course,
            data.user as StoredCredentialKey,
          )
        })
      }
    })
  }
})
