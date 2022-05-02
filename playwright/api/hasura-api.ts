import { GraphQLClient, gql } from 'graphql-request'

import { CourseLevel, InviteStatus } from '@app/types'

import { HASURA_BASE_URL } from '../constants'
import { Course, User } from '../data/types'
import { getAdminIdToken } from '../util'

const endpoint = `${HASURA_BASE_URL}/v1/graphql`

let graphQLClient: GraphQLClient
const getClient = () => {
  if (!graphQLClient) {
    graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${getAdminIdToken()}`,
        'x-hasura-role': 'admin',
      },
    })
  }
  return graphQLClient
}

export const getTrainerCourses = async (email: string): Promise<Course[]> => {
  const query = gql`query MyQuery {
    course(where: {trainers: {profile: {email: {_eq: "${email}"}}}}, order_by: {name: asc}) {
      id
      deliveryType
      description
      level
      min_participants
      max_participants
      name
      reaccreditation
      organization {
        name
      }
      schedule {
        start
        end
      }
      status
      type
    }}
  `
  const response = await getClient().request(query)
  response.course.forEach((course: Course) => {
    course.schedule.forEach(schedule => {
      schedule.start = new Date(schedule.start)
      schedule.end = new Date(schedule.end)
    })
  })
  return response.course
}

export const getOrganizationId = async (name: string): Promise<string> => {
  const query = gql`query MyQuery { organization(where: {name: {_eq: "${name}"}}) { id }}`
  const response = await getClient().request(query)
  return response.organization[0].id
}

export const getVenueId = async (name: string): Promise<string> => {
  const query = gql`query MyQuery { venue(where: {name: {_eq: "${name}"}}) { id }}`
  const response = await getClient().request(query)
  return response.venue[0].id
}

export const getProfileId = async (email: string): Promise<string> => {
  const query = gql`query MyQuery { profile(where: {email: {_eq: "${email}"}}) { id }}`
  const response = await getClient().request(query)
  return response.profile[0].id
}

export const setCourseDates = async (
  courseId: number,
  newStart: Date,
  newEnd: Date
) => {
  const query = gql`
    mutation MyMutation {
      update_course_schedule(
        where: { course_id: { _eq: ${courseId} } }
        _set: { start: "${newStart.toISOString()}", end: "${newEnd.toISOString()}" }
      ) {
        affected_rows
      }
    }
  `
  try {
    await getClient().request(query)
  } catch (e) {
    console.error(e)
  }
}

export const insertCourse = async (
  course: Course,
  email: string,
  trainerStatus = InviteStatus.PENDING
): Promise<number> => {
  const organization = course.organization
    ? `, organization_id: "${await getOrganizationId(
        course.organization.name
      )}"`
    : ''
  const contactProfile = course.contactProfile
    ? `, contactProfileId: "${await getProfileId(course.contactProfile.email)}"`
    : ''
  const venue = course.schedule[0].venue
    ? `, venue_id: "${await getVenueId(course.schedule[0].venue)}"`
    : ''

  const trainerId = await getProfileId(email)

  const query = gql`
    mutation MyMutation {
      insert_course(objects: {
        deliveryType: ${course.deliveryType},
        description: "${course.description}",
        trainers: {
          data: {
            profile_id: "${trainerId}",
            type: LEADER,
            status: ${trainerStatus}
          }
        },
        go1Integration: ${course.go1Integration ? 'true' : 'false'},
        level: ${course.level},
        min_participants: ${course.min_participants},
        max_participants: ${course.max_participants},
        name: "${course.name}",
        reaccreditation: ${course.reaccreditation},
        status: ${course.status},
        type: ${course.type},
        schedule: {
          data: {
            start: "${course.schedule[0].start.toISOString()}",
            end: "${course.schedule[0].end.toISOString()}"${venue}
          }
        }
        ${organization}
        ${contactProfile}
      }) {
        returning {
          id
        }
      }
    }
  `
  const response = await getClient().request(query)
  const id = response.insert_course.returning[0].id
  if (id) {
    console.log(`Inserted course with ID ${id}`)
    return id
  }
  throw Error('Could not insert the course')
}

export const makeSureTrainerHasCourses = async (
  courses: Course[],
  email: string
) => {
  const existingCourses = await getTrainerCourses(email)
  for (const course of courses) {
    if (!existingCourses.map(c => c.description).includes(course.description)) {
      course.id = await insertCourse(course, email)
    }
  }
}

export const deleteCourse = async (id?: number) => {
  if (!id) {
    console.log(`Cannot delete the course without id`)
    return
  }
  console.log(`Deleting the course with id "${id}"`)
  const query = gql`
    mutation MyMutation {
      delete_course_trainer(where: { course_id: { _eq: ${id} } }) { affected_rows }
      delete_course_schedule(where: { course_id: { _eq: ${id} } }) { affected_rows }
      delete_course_module(where: { courseId: { _eq: ${id} } }) { affected_rows }
      delete_course_certificate(where: {courseId: {_eq: ${id}}}) { affected_rows }
      delete_course_participant_module(where: {course_participant: {course_id: {_eq: ${id}}}}) { affected_rows }
      delete_course_participant(where: { course_id: { _eq: ${id} } }) { affected_rows }
      delete_course_invites(where: { course_id: { _eq: ${id} } }) { affected_rows }
      delete_course(where: { id: { _eq: ${id} } }) { affected_rows }
    }
  `
  try {
    await getClient().request(query)
  } catch (e) {
    console.error(e)
  }
}

export const getModuleIds = async (
  moduleGroups: string[],
  level: CourseLevel
): Promise<string[]> => {
  const query = gql`
    query MyQuery {
      module_group(
        where: {
          name: { _in: ${JSON.stringify(moduleGroups)} }
          _and: { level: { _eq: ${level} } }
        }
      ) {
        modules {
          id
        }
      }
    }
  `
  const response = await getClient().request(query)
  return response.module_group.flatMap((m: { modules: { id: string }[] }) =>
    m.modules.flatMap(i => i.id)
  )
}

export const insertCourseModules = async (
  courseId: number,
  moduleIds: string[]
) => {
  const modules = moduleIds.map(id => ({ courseId: courseId, moduleId: id }))
  const query = gql`
    mutation MyMutation($objects: [course_module_insert_input!] = []) {
      insert_course_module(objects: $objects) {
        affected_rows
      }
    }
  `
  try {
    await getClient().request(query, { objects: modules })
  } catch (e) {
    console.error(e)
  }
}

export const insertCourseParticipants = async (
  courseId: number,
  users: User[],
  bookingDate: Date
) => {
  const participants = []
  for (const user of users) {
    const profileId = await getProfileId(user.email)
    participants.push({
      attended: true,
      bookingDate: bookingDate.toISOString(),
      course_id: courseId,
      invite: {
        data: {
          course_id: courseId,
          email: user.email,
          status: InviteStatus.ACCEPTED,
        },
      },
      profile_id: profileId,
    })
  }
  const query = gql`
    mutation MyMutation($objects: [course_participant_insert_input!] = []) {
      insert_course_participant(objects: $objects) {
        affected_rows
      }
    }
  `
  try {
    await getClient().request(query, { objects: participants })
  } catch (e) {
    console.error(e)
  }
}
