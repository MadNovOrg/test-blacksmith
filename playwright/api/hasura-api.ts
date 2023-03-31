import { addYears } from 'date-fns'
import { gql, GraphQLClient } from 'graphql-request'

import {
  BlogQuery,
  BlogQueryVariables,
  CategoryQuery,
  CategoryQueryVariables,
  EbooksQuery,
  EbooksQueryVariables,
  Go1_Licenses_Insert_Input,
  Grade_Enum,
  Organization_Bool_Exp,
  Organization_Insert_Input,
  Organization_Member_Insert_Input,
  Podcast,
  PodcastQuery,
  PodcastQueryVariables,
  PodcastsQuery,
  PodcastsQueryVariables,
  PostQuery,
  PostQueryVariables,
  PostSummaryFragment,
  ResearchSummariesQuery,
  ResearchSummariesQueryVariables,
  TagQuery,
  TagQueryVariables,
  VideoItemQuery,
  VideoItemQueryVariables,
  VideoItemSummaryFragment,
  VideoSeriesQuery,
  VideoSeriesQueryVariables,
  WebinarQuery,
  WebinarQueryVariables,
  WebinarsQuery,
  WebinarsQueryVariables,
  WebinarSummaryFragment,
} from '@app/generated/graphql'
import { MUTATION as SAVE_COURSE_GRADING } from '@app/queries/grading/save-course-grading'
import BLOG_QUERY from '@app/queries/membership/blog'
import CATEGORY_QUERY from '@app/queries/membership/category'
import EBOOKS_QUERY from '@app/queries/membership/ebooks'
import PODCAST_QUERY from '@app/queries/membership/podcast'
import PODCASTS_QUERY from '@app/queries/membership/podcasts'
import POST_QUERY from '@app/queries/membership/post'
import researchSummaries from '@app/queries/membership/research-summaries'
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
  ModuleGroup,
} from '@app/types'

import { HASURA_BASE_URL, HASURA_SECRET } from '../constants'
import { getModulesByLevel } from '../data/modules'
import { Course, OrderCreation, User } from '../data/types'

const endpoint = `${HASURA_BASE_URL}/v1/graphql`

let graphQLClient: GraphQLClient
export const getClient = () => {
  if (!graphQLClient) {
    graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        'x-hasura-admin-secret': HASURA_SECRET,
      },
    })
  }
  return graphQLClient
}

export const getTrainerCourses = async (email: string): Promise<Course[]> => {
  const query = gql`
    query MyQuery {
      course(
        where: {
          _or: [
            {
              trainers: {
                profile: {
                  email: { _eq: "${email}" }
                }
              }
            }
            {
              _and: [
                { type: { _eq: OPEN } }
                {
                  participants: {
                    profile: {
                      organizations: {
                        organization: {
                          members: {
                            _and: [
                              { isAdmin: { _eq: true } }
                              {
                                profile: {
                                  email: {
                                    _eq: "${email}"
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                    }
                  }
                }
              ]
            }
            {
              organization: {
                members: {
                  _and: [
                    {
                      profile: {
                        email: {
                          _eq: "${email}"
                        }
                      }
                    }
                    { isAdmin: { _eq: true } }
                  ]
                }
              }
            }
            { _and: [{ type: { _eq: OPEN } }, { status: { _eq: SCHEDULED } }] }
          ]
        }
        order_by: { name: asc }
      ) {
        id
        deliveryType
        description
        level
        min_participants
        max_participants
        name
        course_code
        reaccreditation
        organization {
          name
        }
        schedule {
          start
          end
          venue {
            name
            city
          }
        }
        trainers {
          id
          profile {
            fullName
          }
        }
        participants_aggregate {
          aggregate {
            count
          }
        }
        status
        type
      }
    }
  `
  const response: { course: Course[] } = await getClient().request(query)
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
  const response: { organization: { id: string }[] } =
    await getClient().request(query)
  return response.organization[0].id
}

export const getVenueId = async (name: string): Promise<string> => {
  const query = gql`query MyQuery { venue(where: {name: {_eq: "${name}"}}) { id }}`
  const response: { venue: { id: string }[] } = await getClient().request(query)
  return response.venue[0].id
}

export const getProfileId = async (email: string): Promise<string> => {
  const query = gql`query MyQuery { profile(where: {email: {_eq: "${email}"}}) { id }}`
  const response: { profile: { id: string }[] } = await getClient().request(
    query
  )
  return response.profile[0].id
}

export const getCourseParticipantId = async (
  courseId: number,
  email: string
): Promise<string> => {
  const query = gql`
    query MyQuery {
      course_participant(
        where: {
          _and: {
            course_id: { _eq: ${courseId} },
            profile_id: { _eq: "${await getProfileId(email)}" }
          }
        }
      ) {
        id
      }
    }
  `
  const response: { course_participant: { id: string }[] } =
    await getClient().request(query)
  return response.course_participant[0].id
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
  const response: { module_group: ModuleGroup[] } = await getClient().request(
    query
  )
  return response.module_group.flatMap((m: { modules: { id: string }[] }) =>
    m.modules.flatMap(i => i.id)
  )
}

export const insertCourse = async (
  course: Course,
  email: string,
  trainerStatus = InviteStatus.PENDING,
  modules = true
): Promise<number> => {
  const organizationId =
    course.organization?.name &&
    (await getOrganizationId(course.organization.name))
  const contactProfileId =
    course.contactProfile?.email &&
    (await getProfileId(course.contactProfile.email))
  const venueId =
    course.schedule[0].venue?.name &&
    (await getVenueId(course.schedule[0].venue.name))
  const trainerId = await getProfileId(email)
  const salesRepresentativeId =
    course.salesRepresentative?.email &&
    (await getProfileId(course.salesRepresentative.email))
  const moduleIds = modules
    ? await getModuleIds(getModulesByLevel(course.level), course.level)
    : []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const courseInput: any = {
    deliveryType: course.deliveryType,
    description: course.description,
    go1Integration: course.go1Integration,
    level: course.level,
    min_participants: course.min_participants,
    max_participants: course.max_participants,
    name: course.name,
    reaccreditation: course.reaccreditation,
    status: course.status,
    type: course.type,
    gradingConfirmed: course.gradingConfirmed,
  }

  if (organizationId) {
    courseInput.organization_id = organizationId
  }
  if (contactProfileId) {
    courseInput.contactProfileId = contactProfileId
  }
  if (salesRepresentativeId) {
    courseInput.salesRepresentativeId = salesRepresentativeId
  }
  if (venueId) {
    courseInput.schedule = {
      data: {
        start: course.schedule[0].start.toISOString(),
        end: course.schedule[0].end.toISOString(),
        venue_id: venueId,
      },
    }
  } else {
    courseInput.schedule = {
      data: {
        start: course.schedule[0].start.toISOString(),
        end: course.schedule[0].end.toISOString(),
      },
    }
  }
  const trainers = {
    data: [
      {
        profile_id: trainerId,
        type: 'LEADER',
        status: trainerStatus,
      },
    ],
  }
  const modulesInput = {
    data: moduleIds.map((moduleId: string) => ({ moduleId: moduleId })),
  }
  const query = gql`
    mutation InsertCourse($course: [course_insert_input!]!) {
      insert_course(objects: $course) {
        returning {
          id
        }
      }
    }
  `
  const variables = {
    course: {
      ...courseInput,
      trainers,
      modules: modulesInput,
    },
  }
  const response: { insert_course: { returning: [{ id: number }] } } =
    await getClient().request(query, variables)
  const id = response.insert_course.returning[0].id
  if (id) {
    console.log(`Inserted course with ID ${id} for ${email}`)
    return id
  }
  throw new Error('Could not insert the course')
}

export const deleteCourse = async (id?: number) => {
  if (!id) {
    console.log(`Cannot delete the course without id`)
    return
  }
  const query = gql`
    mutation MyMutation {
      delete_course_participant_module(where: {course_participant: {course_id: {_eq: ${id}}}}) { affected_rows }
      delete_course_participant(where: {course_id: {_eq: ${id}}}) { affected_rows }
      delete_course_participant_audit(where: {course_id: {_eq: ${id}}}) { affected_rows }
      delete_course_invites(where: {course_id: {_eq: ${id}}}) { affected_rows }
      delete_course_trainer(where: {course_id: {_eq: ${id}}}) { affected_rows }
      delete_course_schedule(where: {course_id: {_eq: ${id}}}) { affected_rows }
      delete_course_module(where: {courseId: {_eq: ${id}}}) { affected_rows }
      delete_course_certificate(where: {courseId: {_eq: ${id}}}) { affected_rows }
      delete_course_enquiry(where: {courseId: {_eq: ${id}}}) { affected_rows }
      delete_course_audit(where: {course_id: {_eq: ${id}}}) { affected_rows }
      delete_order(where: {courseId: {_eq: ${id}}}) { affected_rows }
      delete_course(where: {id: {_eq: ${id}}}) { affected_rows }
    }
  `
  try {
    await getClient().request(query)
    console.log(`Deleted course with the id "${id}"`)
  } catch (e) {
    console.error(`ERROR: ${e}`)
  }
}

export const makeSureTrainerHasCourses = async (
  courses: Course[],
  email: string
): Promise<Course[]> => {
  const existingCourses = await getTrainerCourses(email)
  for (const course of courses) {
    if (!existingCourses.map(c => c.description).includes(course.description)) {
      course.id = await insertCourse(course, email, InviteStatus.ACCEPTED)
    }
  }
  const allCourses = await getTrainerCourses(email)
  const newCourses = allCourses.filter(
    course => !existingCourses.map(c => c.id).includes(course.id)
  )
  return newCourses
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
    throw new Error(`Failed to insert course modules: ${e}`)
  }
}

export const insertCourseParticipants = async (
  courseId: number,
  users: User[],
  bookingDate = new Date()
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
            email
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
    response.insert_course_participant.returning.forEach(user => {
      console.log(`Adding ${user.profile.email} to ${courseId}`)
    })
    return response.insert_course_participant.returning
  } catch (e) {
    console.error(e)
  }
  return []
}

async function setStatus(
  users: string[],
  moduleIds: string[]
): Promise<
  { completed: boolean; course_participant_id: string; module_id: string }[]
> {
  const statuses = []
  for (const user of users) {
    for (const moduleId of moduleIds) {
      statuses.push({
        completed: true,
        course_participant_id: user,
        module_id: moduleId,
      })
    }
  }
  return statuses
}

export async function insertCourseGradingForParticipants(
  course: Course,
  users: User[],
  grade: Grade_Enum
): Promise<void> {
  const courseId = course.id
  const participantIds = await Promise.all(
    users.map(user => getCourseParticipantId(courseId, user.email))
  )
  const moduleIds = (
    await getModuleIds(getModulesByLevel(course.level), course.level)
  ).map((moduleId: string) => moduleId)
  const modules = await setStatus(participantIds, moduleIds)
  try {
    await getClient().request<{
      update_course_participant: { affected_rows: number }
    }>(SAVE_COURSE_GRADING, {
      modules,
      participantIds,
      grade,
      courseId,
    })
    console.log(`
      Updated the grade to "${grade}" for the following users on course "${courseId}":
        - ${users
          .map(user => `${user.givenName} ${user.familyName}`)
          .join('\n    - ')}
    `)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function insertCertificateForParticipants(
  course: Course,
  users: User[]
): Promise<void> {
  const variables = users.map(async user => ({
    certificationDate: new Date().toISOString(),
    courseId: course.id,
    expiryDate: addYears(new Date(), 1).toISOString(),
    profileId: await getProfileId(user.email),
    courseName: course.name,
    courseLevel: course.level,
    number: `${course.id}-1`,
  }))
  const certificateQuery = gql`
    mutation insertCertificate($objects: [course_certificate_insert_input!]!) {
      insert_course_certificate(objects: $objects) {
        returning {
          id
        }
      }
    }
  `
  let certificateResult
  try {
    certificateResult = await getClient().request<{
      insert_course_certificate: { returning: { id: number }[] }
    }>(certificateQuery, {
      objects: await Promise.all(variables),
    })

    console.log(`
      Inserted certificates for the following users on course "${course.id}":
        - ${users
          .map(user => `${user.givenName} ${user.familyName}`)
          .join('\n    - ')}
    `)
  } catch (e) {
    console.error(e)
    throw e
  }

  const certificateIds =
    certificateResult.insert_course_certificate.returning.map(
      certificate => certificate.id
    )

  const participantQuery = gql`
    mutation updateParticipant($id: uuid!, $certificateId: uuid!) {
      update_course_participant(
        where: { id: { _eq: $id } }
        _set: { certificate_id: $certificateId }
      ) {
        affected_rows
      }
    }
  `
  try {
    await Promise.all(
      users.map(async participant => {
        const certificateId = certificateIds.shift()
        if (!certificateId) {
          return
        }

        try {
          await getClient().request<{
            update_course_participant: { affected_rows: number }
          }>(participantQuery, {
            id: await getCourseParticipantId(course.id, participant.email),
            certificateId,
          })
        } catch (e) {
          console.error(e)
          throw e
        }
      })
    )
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function getAllPodcasts(): Promise<Podcast[]> {
  const response = await getClient().request<
    PodcastsQuery,
    PodcastsQueryVariables
  >(PODCASTS_QUERY, { input: { paging: { page: 1, perPage: 1000 } } })
  return response.podcasts?.records ?? []
}

export async function getPodcastById(id: string): Promise<Podcast | null> {
  const response = await getClient().request<
    PodcastQuery,
    PodcastQueryVariables
  >(PODCAST_QUERY, { id })
  return response.podcast?.podcast ?? null
}

export async function getVideoItems(
  first = 1000
): Promise<Array<VideoItemSummaryFragment | null>> {
  const response = await getClient().request<
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
  const response = await getClient().request<
    VideoItemQuery,
    VideoItemQueryVariables
  >(VIDEO_ITEM_QUERY, { id })
  return response.content?.videoSeriesItem || null
}

export async function getBlogPosts(
  first = 1000
): Promise<(PostSummaryFragment | null)[]> {
  const response = await getClient().request<BlogQuery, BlogQueryVariables>(
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
  const response = await getClient().request<PostQuery, PostQueryVariables>(
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
  const response = await getClient().request<{
    content?: { tags?: { nodes?: Array<{ id: string }> } }
  }>(query)
  if (response.content?.tags?.nodes?.length) {
    return response.content.tags.nodes[0].id
  }
  return null
}

export async function getTagById(id: string) {
  const response = await getClient().request<TagQuery, TagQueryVariables>(
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
  const response = await getClient().request<{
    content?: { categories?: { nodes?: Array<{ id: string }> } }
  }>(query)
  if (response.content?.categories?.nodes?.length) {
    return response.content.categories.nodes[0].id
  }
  return null
}

export async function getCategoryById(id: string) {
  const response = await getClient().request<
    CategoryQuery,
    CategoryQueryVariables
  >(CATEGORY_QUERY, { id })
  if (response.content?.category) {
    return response.content.category
  }
  return null
}

export async function getEbooks(first = 1000) {
  const response = await getClient().request<EbooksQuery, EbooksQueryVariables>(
    EBOOKS_QUERY,
    { first }
  )
  if (response.content?.ebooks?.nodes?.length) {
    return response.content.ebooks.nodes
  }
  return []
}

export async function getResearchSummaries(first = 1000) {
  const response = await getClient().request<
    ResearchSummariesQuery,
    ResearchSummariesQueryVariables
  >(researchSummaries, { first })
  if (response.content?.researchSummaries?.nodes?.length) {
    return response.content.researchSummaries.nodes
  }
  return []
}

export async function getWebinars(
  first = 1000
): Promise<Array<WebinarSummaryFragment | null>> {
  const response = await getClient().request<
    WebinarsQuery,
    WebinarsQueryVariables
  >(WEBINARS_QUERY, { first })
  if (response.content?.webinars?.nodes) {
    return response.content.webinars.nodes
  }
  return []
}

export async function getWebinarById(
  id: string
): Promise<WebinarSummaryFragment | null> {
  const response = await getClient().request<
    WebinarQuery,
    WebinarQueryVariables
  >(WEBINAR_QUERY, { id })
  return response.content?.webinar || null
}

export async function insertOrganization(
  input: Organization_Insert_Input
): Promise<string> {
  const mutation = gql`
    mutation InsertOrganization($object: organization_insert_input!) {
      insert_organization_one(object: $object) {
        id
      }
    }
  `
  const response: { insert_organization_one: { id: string } } =
    await getClient().request(mutation, { object: input })
  return response?.insert_organization_one?.id
}

export async function deleteOrganization(id: string): Promise<boolean> {
  const mutation = gql`
    mutation DeleteOrganization($id: uuid!) {
      delete_organization_by_pk(id: $id) {
        id
      }
    }
  `
  const response: { delete_organization_by_pk: { id: boolean } } =
    await getClient().request(mutation, { id })
  return response?.delete_organization_by_pk?.id
}

export async function deleteOrganizationsWhere(
  where: Organization_Bool_Exp
): Promise<boolean> {
  const mutation = gql`
    mutation DeleteOrganizations($where: organization_bool_exp!) {
      delete_organization(where: $where) {
        affected_rows
      }
    }
  `
  const response: { delete_organization: { affected_rows: boolean } } =
    await getClient().request(mutation, { where })
  return response?.delete_organization?.affected_rows
}

export async function insertOrganizationMember(
  input: Organization_Member_Insert_Input
) {
  const mutation = gql`
    mutation InsertOrganizationMember(
      $input: organization_member_insert_input!
    ) {
      insert_organization_member_one(object: $input) {
        id
      }
    }
  `
  const response: { insert_organization_member_one: { id: string } } =
    await getClient().request(mutation, { input })
  return response?.insert_organization_member_one?.id
}

export async function deleteOrganizationMember(id: string): Promise<boolean> {
  const mutation = gql`
    mutation DeleteOrganizationMember($id: uuid!) {
      delete_organization_member_by_pk(id: $id) {
        id
      }
    }
  `
  const response: { delete_organization_member_by_pk: { id: boolean } } =
    await getClient().request(mutation, { id })
  return response?.delete_organization_member_by_pk?.id
}

export async function insertGo1License(input: Go1_Licenses_Insert_Input) {
  const mutation = gql`
    mutation InsertGo1License($input: go1_licenses_insert_input!) {
      insert_go1_licenses_one(object: $input) {
        id
      }
    }
  `
  const response: { insert_go1_licenses_one: { id: string } } =
    await getClient().request(mutation, { input })
  return response?.insert_go1_licenses_one?.id
}

export async function deleteGo1License(id: string): Promise<boolean> {
  const mutation = gql`
    mutation DeleteGo1License($id: uuid!) {
      delete_go1_licenses_by_pk(id: $id) {
        id
      }
    }
  `
  const response: { delete_go1_licenses_by_pk: { id: boolean } } =
    await getClient().request(mutation, { id })
  return response?.delete_go1_licenses_by_pk?.id
}

export async function insertOrder(input: OrderCreation): Promise<number> {
  const mutation = gql`
    mutation InsertOrder($object: order_insert_input!) {
      order: insert_order_one(object: $object) {
        id
      }
    }
  `
  try {
    const response = await getClient().request<{ order: { id: number } }>(
      mutation,
      { object: input }
    )
    console.log(
      `Inserted order with ID "${response?.order.id}" for course "${input.courseId}"`
    )
    return response?.order.id
  } catch (error) {
    throw new Error(`Failed to create order: ${error}`)
  }
}
