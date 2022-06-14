import { GraphQLClient, gql } from 'graphql-request'

import {
  BlogQuery,
  BlogQueryVariables,
  Podcast,
  PodcastQuery,
  PodcastQueryVariables,
  PodcastsQuery,
  PodcastsQueryVariables,
  VideoSeriesQuery,
  VideoItemSummaryFragment,
  VideoItemQuery,
  VideoItemQueryVariables,
  VideoSeriesQueryVariables,
  PostSummaryFragment,
  PostQuery,
  PostQueryVariables,
  TagQuery,
  TagQueryVariables,
  CategoryQuery,
  CategoryQueryVariables,
  WebinarsQuery,
  WebinarsQueryVariables,
  WebinarQuery,
  WebinarQueryVariables,
} from '@app/generated/graphql'
import BLOG_QUERY from '@app/queries/membership/blog'
import CATEGORY_QUERY from '@app/queries/membership/category'
import PODCAST_QUERY from '@app/queries/membership/podcast'
import PODCASTS_QUERY from '@app/queries/membership/podcasts'
import POST_QUERY from '@app/queries/membership/post'
import TAG_QUERY from '@app/queries/membership/tag'
import VIDEO_ITEM_QUERY from '@app/queries/membership/video-item'
import VIDEO_SERIES_QUERY from '@app/queries/membership/video-series'
import WEBINAR_QUERY from '@app/queries/membership/webinar'
import WEBINARS_QUERY from '@app/queries/membership/webinars'
import {
  CourseLevel,
  CourseModule,
  CourseParticipant,
  InviteStatus,
} from '@app/types'

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
        gradingConfirmed: ${course.gradingConfirmed}
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
  moduleIds: string[],
  covered?: boolean
): Promise<CourseModule[]> => {
  const modules = moduleIds.map(id => ({
    courseId: courseId,
    moduleId: id,
    covered: covered ?? null,
  }))
  const query = gql`
    mutation MyMutation($objects: [course_module_insert_input!] = []) {
      insert_course_module(objects: $objects) {
        affected_rows
        returning {
          module {
            moduleGroup {
              name
            }
          }
        }
      }
    }
  `
  try {
    const response = await getClient().request<{
      insert_course_module: { returning: CourseModule[] }
    }>(query, { objects: modules })

    return response.insert_course_module.returning
  } catch (e) {
    console.error(e)
  }

  return []
}

export const insertCourseParticipants = async (
  courseId: number,
  users: User[],
  bookingDate: Date
): Promise<CourseParticipant[]> => {
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
    mutation InsertCourseParticipants(
      $objects: [course_participant_insert_input!] = []
    ) {
      insert_course_participant(objects: $objects) {
        affected_rows
        returning {
          id
          profile {
            id
            fullName
          }
        }
      }
    }
  `
  try {
    const response = await getClient().request<{
      insert_course_participant: { returning: CourseParticipant[] }
    }>(query, { objects: participants })

    return response.insert_course_participant.returning
  } catch (e) {
    console.error(e)
  }

  return []
}

export async function getAllPodcasts(): Promise<Podcast[]> {
  const client = getClient()

  const response = await client.request<PodcastsQuery, PodcastsQueryVariables>(
    PODCASTS_QUERY,
    { input: { paging: { page: 1, perPage: 1000 } } }
  )

  return response.podcasts?.records ?? []
}

export async function getPodcastById(id: string): Promise<Podcast | null> {
  const client = getClient()

  const response = await client.request<PodcastQuery, PodcastQueryVariables>(
    PODCAST_QUERY,
    { id }
  )

  return response.podcast?.podcast ?? null
}

export async function getVideoItems(
  first = 1000
): Promise<Array<VideoItemSummaryFragment | null>> {
  const client = getClient()

  const response = await client.request<
    VideoSeriesQuery,
    VideoSeriesQueryVariables
  >(VIDEO_SERIES_QUERY, { first })

  if (response.content?.videoSeriesItems?.nodes) {
    return response.content.videoSeriesItems.nodes
  }

  return []
}

export async function getVideoItemById(
  id: string
): Promise<VideoItemSummaryFragment | null> {
  const client = getClient()

  const response = await client.request<
    VideoItemQuery,
    VideoItemQueryVariables
  >(VIDEO_ITEM_QUERY, { id })

  return response.content?.videoSeriesItem || null
}

export async function getBlogPosts(
  first = 1000
): Promise<(PostSummaryFragment | null)[]> {
  const client = getClient()

  const response = await client.request<BlogQuery, BlogQueryVariables>(
    BLOG_QUERY,
    {
      first,
    }
  )

  if (response.content?.posts?.nodes) {
    return response.content.posts.nodes
  }

  return []
}

export async function getPostById(
  id: string
): Promise<PostSummaryFragment | null> {
  const client = getClient()

  const response = await client.request<PostQuery, PostQueryVariables>(
    POST_QUERY,
    { id }
  )

  return response.content?.post || null
}

export async function getFirstTagIdWithPosts(): Promise<string | null> {
  const query = gql`
    query FirstTagWithPosts {
      content {
        tags(where: { hideEmpty: true }, first: 1) {
          nodes {
            id
          }
        }
      }
    }
  `

  const client = getClient()
  const response = await client.request<{
    content?: { tags?: { nodes?: Array<{ id: string }> } }
  }>(query)

  if (response.content?.tags?.nodes?.length) {
    return response.content.tags.nodes[0].id
  }

  return null
}

export async function getTagById(id: string) {
  const client = getClient()

  const response = await client.request<TagQuery, TagQueryVariables>(
    TAG_QUERY,
    { id }
  )

  if (response.content?.tag) {
    return response.content.tag
  }

  return null
}

export async function getFirstCategoryIdWithPosts(): Promise<string | null> {
  const query = gql`
    query FirstCategoryWithPosts {
      content {
        categories(where: { hideEmpty: true }, first: 1) {
          nodes {
            id
          }
        }
      }
    }
  `

  const client = getClient()
  const response = await client.request<{
    content?: { categories?: { nodes?: Array<{ id: string }> } }
  }>(query)

  if (response.content?.categories?.nodes?.length) {
    return response.content.categories.nodes[0].id
  }

  return null
}

export async function getCategoryById(id: string) {
  const client = getClient()

  const response = await client.request<CategoryQuery, CategoryQueryVariables>(
    CATEGORY_QUERY,
    { id }
  )

  if (response.content?.category) {
    return response.content.category
  }

  return null
}

export async function getWebinars(first = 1000) {
  const client = getClient()

  const response = await client.request<WebinarsQuery, WebinarsQueryVariables>(
    WEBINARS_QUERY,
    { first }
  )

  if (response.content?.webinars?.nodes) {
    return response.content.webinars.nodes
  }

  return []
}

export async function getWebinarById(id: string) {
  const client = getClient()

  const response = await client.request<WebinarQuery, WebinarQueryVariables>(
    WEBINAR_QUERY,
    { id }
  )

  return response.content?.webinar || null
}
