import { CourseStatus, CourseType } from '../../src/types'
import {
  insertCourse,
  getModuleIds,
  insertCourseModules,
  insertCourseParticipants,
} from '../api/hasura-api'
import { UNIQUE_COURSE } from '../data/courses'
import { MODULES_BY_LEVEL } from '../data/modules'
import { users } from '../data/users'

for (let i = 0; i < 3; i++) {
  const course = UNIQUE_COURSE()
  course.name = 'Positive Behaviour Training: Level One'
  course.type = CourseType.CLOSED
  course.status = CourseStatus.PUBLISHED
  course.schedule[0].start = new Date('2022-02-15T09:00:00Z')
  course.schedule[0].end = new Date('2022-02-15T16:00:00Z')
  await insertCourse(course, process.argv[0])

  const moduleIds = await getModuleIds(
    MODULES_BY_LEVEL.get(course.level),
    course.level
  )
  await insertCourseModules(course.id, moduleIds)
  await insertCourseParticipants(
    course.id,
    [users.user1WithOrg, users.user2WithOrg],
    new Date('2022-02-14T00:00:00Z')
  )
}
