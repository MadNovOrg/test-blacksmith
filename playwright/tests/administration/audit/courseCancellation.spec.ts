import { test as base } from '@playwright/test'

import { Course_Status_Enum } from '@app/generated/graphql'
import { InviteStatus } from '@app/types'

import * as API from '../../../api'
import { TEST_SETTINGS } from '../../../constants'
import { UNIQUE_COURSE } from '../../../data/courses'
import { Audit_Type } from '../../../data/enums'
import { Course } from '../../../data/types'
import { users } from '../../../data/users'
import { stateFilePath } from '../../../hooks/global-setup'
import { AuditPage } from '../../../pages/administration/AuditPage'

const test = base.extend<{ course: Course; role: string }>({
  course: async ({}, use) => {
    const course = UNIQUE_COURSE()
    course.organization = { name: 'London First School' }
    course.status = Course_Status_Enum.Scheduled
    course.id = await API.course.insertCourse(
      course,
      users.trainer.email,
      InviteStatus.ACCEPTED
    )
    await use(course)
    await API.course.deleteCourse(course.id)
  },
})

test.use({ storageState: stateFilePath('admin') })

test.beforeEach(async ({}) => {
  TEST_SETTINGS.role = 'tt-admin'
})

test.afterEach(async ({}) => {
  TEST_SETTINGS.role = ''
})

test('displays the audit trail for a cancelled course', async ({
  course,
  page,
}) => {
  API.course.cancelCourse(course.id)
  const auditPage = new AuditPage(page)
  await auditPage.goto(Audit_Type.CourseCancellation)
  await auditPage.checkCourseCancelled(course.id)
})
