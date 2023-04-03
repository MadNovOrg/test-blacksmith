import { expect, test as base } from '@playwright/test'

import { Course_Source_Enum, Course_Status_Enum } from '@app/generated/graphql'
import { CourseType, RoleName } from '@app/types'

import * as API from '../../../api'
import { UNIQUE_COURSE } from '../../../data/courses'
import { users } from '../../../data/users'
import {
  AdminCourseQuery,
  TrainerCourseQuery,
  UnverifiedUserCoursesQuery,
} from '../../../generated/graphql'
import { runQueryAsRole } from '../../queries/gql-query'

import {
  ADMIN_COURSE_QUERY,
  TRAINER_COURSE_QUERY,
  UNVERIFIED_USER_COURSES_QUERY,
} from './queries'

const test = base.extend<{
  courseIds: {
    openCourseId: number
    closedCourseId: number
    indirectCourseId: number
    trainerCourseId: number
    notTrainerCourseId: number
    confirmModulesCourseId: number
    scheduledCourseId: number
    trainerMissingCourseId: number
    trainerPendingCourseId: number
    trainerUnavailableCourseId: number
  }
}>({
  courseIds: async ({}, use) => {
    const [
      openCourseId,
      closedCourseId,
      indirectCourseId,
      trainerCourseId,
      notTrainerCourseId,
      confirmModulesCourseId,
      scheduledCourseId,
      trainerMissingCourseId,
      trainerPendingCourseId,
      trainerUnavailableCourseId,
    ] = await Promise.all([
      API.course.insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.OPEN,
        },
        users.trainer.email
      ),
      API.course.insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.CLOSED,
          source: Course_Source_Enum.EmailEnquiryCentral,
        },
        users.trainer.email
      ),
      API.course.insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.INDIRECT,
        },
        users.trainer.email
      ),
      API.course.insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.OPEN,
        },
        users.trainer.email
      ),
      API.course.insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.CLOSED,
          source: Course_Source_Enum.EmailEnquiryCentral,
        },
        users.trainerWithOrg.email
      ),
      API.course.insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.OPEN,
          status: Course_Status_Enum.ConfirmModules,
        },
        users.trainer.email
      ),
      API.course.insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.OPEN,
          status: Course_Status_Enum.Scheduled,
        },
        users.trainer.email
      ),
      API.course.insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.OPEN,
          status: Course_Status_Enum.TrainerMissing,
        },
        users.trainer.email
      ),
      API.course.insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.OPEN,
          status: Course_Status_Enum.TrainerPending,
        },
        users.trainer.email
      ),
      API.course.insertCourse(
        {
          ...UNIQUE_COURSE(),
          type: CourseType.OPEN,
          status: Course_Status_Enum.TrainerUnavailable,
        },
        users.trainer.email
      ),
    ])
    await use({
      openCourseId,
      closedCourseId,
      indirectCourseId,
      trainerCourseId,
      notTrainerCourseId,
      confirmModulesCourseId,
      scheduledCourseId,
      trainerMissingCourseId,
      trainerPendingCourseId,
      trainerUnavailableCourseId,
    })
    await Promise.all([
      API.course.deleteCourse(openCourseId),
      API.course.deleteCourse(closedCourseId),
      API.course.deleteCourse(indirectCourseId),
      API.course.deleteCourse(trainerCourseId),
      API.course.deleteCourse(notTrainerCourseId),
      API.course.deleteCourse(confirmModulesCourseId),
      API.course.deleteCourse(scheduledCourseId),
      API.course.deleteCourse(trainerMissingCourseId),
      API.course.deleteCourse(trainerPendingCourseId),
      API.course.deleteCourse(trainerUnavailableCourseId),
    ])
  },
})

test('@query sales admin can select open and closed courses, but not indirect course', async ({
  courseIds,
}) => {
  const [openCourse, closedCourse, indirectCourse] = await Promise.all([
    runQueryAsRole<AdminCourseQuery>(
      ADMIN_COURSE_QUERY,
      { id: courseIds.openCourseId },
      RoleName.SALES_ADMIN
    ),
    runQueryAsRole<AdminCourseQuery>(
      ADMIN_COURSE_QUERY,
      { id: courseIds.closedCourseId },
      RoleName.SALES_ADMIN
    ),
    runQueryAsRole<AdminCourseQuery>(
      ADMIN_COURSE_QUERY,
      { id: courseIds.indirectCourseId },
      RoleName.SALES_ADMIN
    ),
  ])

  expect(openCourse?.course_by_pk?.id).toEqual(courseIds.openCourseId)
  expect(closedCourse.course_by_pk?.id).toEqual(courseIds.closedCourseId)
  expect(indirectCourse.course_by_pk?.id).toBeFalsy()
})

test('@query trainer can select only courses where they are a trainer', async ({
  courseIds,
}) => {
  const profileId = await API.profile.getProfileId(users.trainer.email)

  console.log(profileId)

  const [trainerCourse, notTrainerCourse] = await Promise.all([
    runQueryAsRole<TrainerCourseQuery>(
      TRAINER_COURSE_QUERY,
      { id: courseIds.trainerCourseId },
      RoleName.TRAINER,
      { 'x-hasura-user-id': profileId }
    ),
    runQueryAsRole<TrainerCourseQuery>(
      TRAINER_COURSE_QUERY,
      { id: courseIds.notTrainerCourseId },
      RoleName.TRAINER,
      { 'x-hasura-user-id': profileId }
    ),
  ])

  test.expect(trainerCourse.course_by_pk?.id).toEqual(courseIds.trainerCourseId)
  test.expect(notTrainerCourse.course_by_pk).toBeFalsy()
})

test('@query tt-ops can select all courses', async ({ courseIds }) => {
  const [openCourse, closedCourse, indirectCourse] = await Promise.all([
    runQueryAsRole<AdminCourseQuery>(
      ADMIN_COURSE_QUERY,
      { id: courseIds.openCourseId },
      RoleName.TT_OPS
    ),
    runQueryAsRole<AdminCourseQuery>(
      ADMIN_COURSE_QUERY,
      { id: courseIds.closedCourseId },
      RoleName.TT_OPS
    ),
    runQueryAsRole<AdminCourseQuery>(
      ADMIN_COURSE_QUERY,
      { id: courseIds.indirectCourseId },
      RoleName.TT_OPS
    ),
  ])

  expect(openCourse?.course_by_pk?.id).toEqual(courseIds.openCourseId)
  expect(closedCourse.course_by_pk?.id).toEqual(courseIds.closedCourseId)
  expect(indirectCourse.course_by_pk?.id).toEqual(courseIds.indirectCourseId)
})

test('@query anonymous users can only select open courses in certain statuses', async ({
  courseIds,
}) => {
  const courses = await runQueryAsRole<UnverifiedUserCoursesQuery>(
    UNVERIFIED_USER_COURSES_QUERY,
    {
      ids: [
        courseIds.confirmModulesCourseId,
        courseIds.scheduledCourseId,
        courseIds.trainerMissingCourseId,
        courseIds.trainerPendingCourseId,
        courseIds.trainerUnavailableCourseId,
        courseIds.closedCourseId,
        courseIds.indirectCourseId,
      ],
    },
    RoleName.UNVERIFIED
  )

  const fetchedCoursesIds = courses.course.map(c => c.id)

  test
    .expect(fetchedCoursesIds.includes(courseIds.indirectCourseId))
    .toBeFalsy()
  test.expect(fetchedCoursesIds.includes(courseIds.closedCourseId)).toBeFalsy()

  const allowedCourseIds = [
    courseIds.confirmModulesCourseId,
    courseIds.scheduledCourseId,
    courseIds.trainerMissingCourseId,
    courseIds.trainerPendingCourseId,
    courseIds.trainerUnavailableCourseId,
  ]

  allowedCourseIds.forEach(id => {
    test.expect(fetchedCoursesIds.includes(id)).toBeTruthy()
  })
})

test('@query unverified users can only select open courses in certain statuses', async ({
  courseIds,
}) => {
  const courses = await runQueryAsRole<UnverifiedUserCoursesQuery>(
    UNVERIFIED_USER_COURSES_QUERY,
    {
      ids: [
        courseIds.confirmModulesCourseId,
        courseIds.scheduledCourseId,
        courseIds.trainerMissingCourseId,
        courseIds.trainerPendingCourseId,
        courseIds.trainerUnavailableCourseId,
        courseIds.closedCourseId,
        courseIds.indirectCourseId,
      ],
    },
    'anonymous'
  )

  const fetchedCoursesIds = courses.course.map(c => c.id)

  test
    .expect(fetchedCoursesIds.includes(courseIds.indirectCourseId))
    .toBeFalsy()
  test.expect(fetchedCoursesIds.includes(courseIds.closedCourseId)).toBeFalsy()

  const allowedCourseIds = [
    courseIds.confirmModulesCourseId,
    courseIds.scheduledCourseId,
    courseIds.trainerMissingCourseId,
    courseIds.trainerPendingCourseId,
    courseIds.trainerUnavailableCourseId,
  ]

  allowedCourseIds.forEach(id => {
    test.expect(fetchedCoursesIds.includes(id)).toBeTruthy()
  })
})
