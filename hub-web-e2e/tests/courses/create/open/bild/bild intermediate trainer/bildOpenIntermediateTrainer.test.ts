import { test as base } from '@playwright/test'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
} from '@app/generated/graphql'

import * as API from '@qa/api'
import { isUK } from '@qa/constants'
import { openCourseSteps } from '@qa/course-test-steps'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { Course } from '@qa/data/types'
import { Accreditors_Enum } from '@qa/generated/graphql'
import { StoredCredentialKey } from '@qa/util'

const allowedUsers = ['admin', 'ops', 'salesAdmin']

allowedUsers.forEach(allowedUser => {
  const dataSet = [
    {
      name: `open BILD intermediate trainer F2F reaccred as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.F2F
        course.reaccreditation = true
        course.conversion = false
        return course
      })(),
    },
    {
      name: `open BILD intermediate trainer F2F non-reaccred non-conversion as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.F2F
        course.conversion = false
        return course
      })(),
    },
    {
      name: `open BILD intermediate trainer F2F conversion as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'ops' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.F2F
        course.conversion = true
        return course
      })(),
    },
    {
      name: `open BILD intermediate trainer mixed conversion as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'salesAdmin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.Mixed
        course.conversion = true
        return course
      })(),
    },
    {
      name: `open BILD intermediate trainer virtual conversion as ${allowedUser}`,
      user: `${allowedUser}`,
      smoke: allowedUser === 'admin' ? '@smoke' : '',
      course: (() => {
        const course = UNIQUE_COURSE()
        course.deliveryType = Course_Delivery_Type_Enum.Virtual
        course.conversion = true
        return course
      })(),
    },
  ]

  for (const data of dataSet) {
    const test = base.extend<{ course: Course }>({
      course: async ({}, use) => {
        await use({
          ...data.course,
          level: Course_Level_Enum.BildIntermediateTrainer,
          accreditedBy: Accreditors_Enum.Bild,
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
          await openCourseSteps(
            browser,
            course,
            data.user as StoredCredentialKey,
          )
        })
      }
    })
  }
})
