import { GraphQLClient, gql } from 'graphql-request'

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
      },
    })
  }
  return graphQLClient
}

export const getTrainerCourses = async (trainer: User): Promise<Course[]> => {
  const query = gql`query MyQuery {
    course(where: {leaders: {profile: {email: {_eq: "${trainer.email}"}}}}, order_by: {name: asc}) {
      id
      deliveryType
      level
      name
      reaccreditation
      organization {
        name
      }
      schedule {
        start
        end
        type
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
  courseId: string,
  newStart: Date,
  newEnd: Date
) => {
  const query = gql`
    mutation MyMutation {
      update_course_schedule(
        where: { course_id: { _eq: "${courseId}" } }
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
  trainer: User
): Promise<Course> => {
  const organization = course.organization
    ? `, organization_id: "${await getOrganizationId(
        course.organization.name
      )}"`
    : ''
  const venue = course.schedule[0].venue
    ? `, venue_id: "${await getVenueId(course.schedule[0].venue)}"`
    : ''
  const trainerId = await getProfileId(trainer.email)
  const query = gql`
    mutation MyMutation {
      insert_course(objects: {
        deliveryType: ${course.deliveryType},
        description: "${course.description}",
        leaders: {
          data: {
            profile_id: "${await getProfileId(trainer.email)}",
            type: LEADER
          }
        },
        level: ${course.level},
        name: "${course.name}",
        reaccreditation: ${course.reaccreditation},
        status: ${course.status},
        trainer_profile_id: "${trainerId}",
        type: ${course.type},
        schedule: {
          data: {
            name: "${course.schedule[0].name}",
            start: "${course.schedule[0].start.toISOString()}",
            end: "${course.schedule[0].end.toISOString()}",
            type: ${course.schedule[0].type}${venue}
          }
        }
        ${organization}
      }) {
        returning {
          id
        }
      }
    }
  `
  const response = await getClient().request(query)
  course.id = response.insert_course.returning[0].id
  console.log(`Inserted course with ID ${course.id}`)
  return course
}

export const makeSureTrainerHasCourses = async (
  courses: Course[],
  trainer: User
) => {
  const existingCourses = await getTrainerCourses(trainer)
  for (const course of courses) {
    if (!existingCourses.map(c => c.name).includes(course.name)) {
      await insertCourse(course, trainer)
    }
  }
}

export const deleteCourse = async (id: string) => {
  console.log(`Deleting the course with id "${id}"`)
  const query = gql`
    mutation MyMutation {
      delete_course_leader(where: { course_id: { _eq: "${id}" } }) { affected_rows }
      delete_course_schedule(where: { course_id: { _eq: "${id}" } }) { affected_rows }
      delete_course_module(where: { courseId: { _eq: "${id}" } }) { affected_rows }
      delete_course_invites(where: { course_id: { _eq: "${id}" } }) { affected_rows }
      delete_course_participant(where: { course_id: { _eq: "${id}" } }) { affected_rows }
      delete_course(where: { id: { _eq: "${id}" } }) { affected_rows }
    }
  `
  try {
    await getClient().request(query)
  } catch (e) {
    console.error(e)
  }
}
