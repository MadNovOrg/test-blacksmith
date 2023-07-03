import { expect, test as base } from '@playwright/test'

import { Course_Source_Enum, Course_Status_Enum } from '@app/generated/graphql'
import { CourseType, RoleName } from '@app/types'

import * as API from '@qa/api'
import { UNIQUE_COURSE } from '@qa/data/courses'
import { users } from '@qa/data/users'
import {
  AdminCourseQuery,
  TrainerCourseQuery,
  UnverifiedUserCoursesQuery,
} from '@qa/generated/graphql'

import { HasuraRole, runQueryAsRole } from '../../queries/gql-query'

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
          status: Course_Status_Enum.TrainerDeclined,
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

// Permissions found in
// hasura/metadata/databases/default/tables/public_course.yaml
const allowedRoles: HasuraRole[] = [
  RoleName.TT_ADMIN,
  RoleName.FINANCE,
  RoleName.SALES_ADMIN,
  RoleName.SALES_REPRESENTATIVE,
]
allowedRoles.forEach(role => {
  test(`@query ${role} can select open, closed and indirect courses`, async ({
    courseIds,
  }) => {
    const [openCourse, closedCourse, indirectCourse] = await Promise.all([
      runQueryAsRole<AdminCourseQuery>(
        ADMIN_COURSE_QUERY,
        { id: courseIds.openCourseId },
        role
      ),
      runQueryAsRole<AdminCourseQuery>(
        ADMIN_COURSE_QUERY,
        { id: courseIds.closedCourseId },
        role
      ),
      runQueryAsRole<AdminCourseQuery>(
        ADMIN_COURSE_QUERY,
        { id: courseIds.indirectCourseId },
        role
      ),
    ])
    expect(openCourse?.course_by_pk?.id).toEqual(courseIds.openCourseId)
    expect(closedCourse.course_by_pk?.id).toEqual(courseIds.closedCourseId)
    expect(indirectCourse.course_by_pk?.id).toEqual(courseIds.indirectCourseId)
  })
})

test('@query trainer can select only courses where they are a trainer', async ({
  courseIds,
}) => {
  const profileId = await API.profile.getProfileId(users.trainer.email)
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

const restrictedRoles: HasuraRole[] = [RoleName.UNVERIFIED, RoleName.ANONYMOUS]
restrictedRoles.forEach(role => {
  test(`@query ${role} users can only select open courses in certain statuses`, async ({
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
      role
    )
    const fetchedCoursesIds = courses.course.map(c => c.id)
    test
      .expect(fetchedCoursesIds.includes(courseIds.indirectCourseId))
      .toBeFalsy()
    test
      .expect(fetchedCoursesIds.includes(courseIds.closedCourseId))
      .toBeFalsy()
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
})
