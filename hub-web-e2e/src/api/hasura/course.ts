import { addYears } from 'date-fns'
import { gql } from 'graphql-request'

import {
  Grade_Enum,
  TransferFeeType,
  Course_Level_Enum,
} from '@app/generated/graphql'
import { SAVE_COURSE_GRADING_MUTATION } from '@app/modules/grading/pages/CourseGrading/queries/save-course-grading'
import { TRANSFER_PARTICIPANT } from '@app/pages/TransferParticipant/queries'
import { CANCEL_COURSE_MUTATION } from '@app/queries/courses/cancel-course'
import { QUERY as TRAINER_COURSES } from '@app/queries/courses/get-trainer-courses'
import { GET_PARTICIPANT } from '@app/queries/participants/get-course-participant-by-profile-id'
import {
  CourseParticipant,
  CourseTrainerType,
  InviteStatus,
  ModuleGroup,
} from '@app/types'

import { getModulesByLevel } from '@qa/data/modules'
import { Course, OrderCreation, User } from '@qa/data/types'
import { Course_Certificate_Insert_Input } from '@qa/generated/graphql'

import { getClient } from './client'
import { getOrganizationId } from './organization'
import { getProfileId } from './profile'
import { getVenueId } from './venue'

export const getTrainerCourses = async (email: string): Promise<Course[]> => {
  const { courses } = await getClient().request<{ courses: Course[] }>(
    TRAINER_COURSES,
    {
      where: {
        trainers: {
          profile_id: { _eq: await getProfileId(email) },
        },
      },
    }
  )
  // Update the start and end times for each course
  const updatedCourses = courses.map(course => {
    return {
      ...course,
      schedule: course.schedule.map(schedule => {
        return {
          ...schedule,
          start: course.dates?.aggregate?.start.date as Date,
          end: course.dates?.aggregate?.end.date as Date,
        }
      }),
    }
  })
  return updatedCourses
}

export const getCourseParticipantId = async (
  courseId: number,
  email: string
): Promise<string> => {
  const profileId = await getProfileId(email)
  const response: { course_participant: { id: string }[] } =
    await getClient().request<{
      course_participant: { id: string }[]
    }>(GET_PARTICIPANT, {
      courseId,
      profileId,
    })
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
  level: Course_Level_Enum
): Promise<string[]> => {
  const query = gql`
    query ModuleGroupsByLevel {
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
  trainerStatus = InviteStatus.ACCEPTED,
  modules = true,
  order?: OrderCreation
): Promise<number> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const courseInput: any = {
    curriculum: course.curriculum,
    deliveryType: course.deliveryType,
    description: course.description,
    go1Integration: course.go1Integration,
    gradingConfirmed: course.gradingConfirmed,
    level: course.level,
    max_participants: course.max_participants,
    min_participants: course.min_participants,
    name: course.name,
    reaccreditation: course.reaccreditation,
    status: course.status,
    type: course.type,
  }
  if (course.organization) {
    courseInput.organization_id = await getOrganizationId(
      course.organization.name
    )
  }
  if (course.bookingContactProfile) {
    const bookingContactProfileId = await getProfileId(
      course.bookingContactProfile.email
    )
    courseInput.bookingContactProfileId = bookingContactProfileId
    courseInput.bookingContactInviteData = {
      email: course.bookingContactProfile.email,
      firstName: course.bookingContactProfile.givenName,
      lastName: course.bookingContactProfile.familyName,
      profileId: bookingContactProfileId,
    }
  }
  if (course.salesRepresentative && course.source && order) {
    courseInput.orders = {
      data: [
        {
          ...order,
          salesRepresentativeId: await getProfileId(
            course.salesRepresentative.email
          ),
          source: course.source,
          user: course.salesRepresentative,
        },
      ],
    }
  }

  if (course.schedule[0].venue) {
    courseInput.schedule = {
      data: {
        start: course.schedule[0].start.toISOString(),
        end: course.schedule[0].end.toISOString(),
        venue_id: await getVenueId(course.schedule[0].venue.name),
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
        profile_id: await getProfileId(email),
        type: CourseTrainerType.Leader,
        status: trainerStatus,
      },
      ...(course.assistTrainer
        ? [
            {
              profile_id: await getProfileId(course.assistTrainer.email),
              type: CourseTrainerType.Assistant,
            },
          ]
        : []),
      ...(course.moderator
        ? [
            {
              profile_id: await getProfileId(course.moderator.email),
              type: CourseTrainerType.Moderator,
            },
          ]
        : []),
    ],
  }
  const moduleIds = modules
    ? await getModuleIds(getModulesByLevel(course.level), course.level)
    : []

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
  for (let i = 1; i <= 10; i++) {
    try {
      const response: { insert_course: { returning: [{ id: number }] } } =
        await getClient().request(query, variables)
      const id = response.insert_course.returning[0].id
      if (id) {
        console.log(`Inserted course with ID ${id} for ${email}`)
        return id
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message.includes('Uniqueness violation')) {
        console.error(
          `Failed to insert course for ${email}, due to uniqueness. Retrying...`
        )
        await new Promise(resolve => setTimeout(resolve, 1000))
      } else {
        throw error
      }
    }
  }
  throw new Error(`Failed to insert course for ${email} after 10 attempts`)
}

export const deleteCourse = async (id?: number) => {
  if (!id) {
    console.log(`Cannot delete the course without id`)
    return
  }
  const query = gql`
    mutation MyMutation($course_id: Int!) {
      delete_course_audit(where: { course_id: { _eq: $course_id } }) {
        affected_rows
      }
      delete_course(where: { id: { _eq: $course_id } }) {
        affected_rows
      }
    }
  `
  try {
    await getClient().request(query, { course_id: id })
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
      course.id = await insertCourse(course, email)
    }
  }
  const allCourses = await getTrainerCourses(email)
  const newCourses = allCourses.filter(
    course => !existingCourses.map(c => c.id).includes(course.id)
  )
  return newCourses
}

export const insertCourseParticipants = async (
  courseId: number,
  users: User[],
  bookingDate = new Date()
): Promise<CourseParticipant[]> => {
  const participants = users.map(async user => {
    const profileId = await getProfileId(user.email)
    return {
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
    }
  })
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
    }>(query, { objects: await Promise.all(participants) })
    response.insert_course_participant.returning.forEach(user => {
      console.log(`Adding ${user.profile.email} to ${courseId}`)
    })
    return response.insert_course_participant.returning
  } catch (e) {
    console.error(e)
    return []
  }
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
    }>(SAVE_COURSE_GRADING_MUTATION, {
      modules,
      participantIds,
      grade,
      courseId,
      notes: [],
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

export async function insertCertificate(course: Course, users: User[]) {
  const variables: Promise<Course_Certificate_Insert_Input>[] = users.map(
    async user => ({
      certificationDate: new Date().toISOString(),
      courseId: course.id,
      expiryDate: addYears(new Date(), 1).toISOString(),
      profileId: await getProfileId(user.email),
      courseName: course.name,
      courseLevel: course.level,
      number: `${course.id}-1`,
      blendedLearning: course.go1Integration,
      reaccreditation: course.reaccreditation,
      courseAccreditedBy: course.accreditedBy,
    })
  )
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
  return certificateResult.insert_course_certificate.returning.map(
    certificate => certificate.id
  )
}

export async function insertCertificateForParticipants(
  course: Course,
  users: User[]
): Promise<void> {
  const certificateIds = await insertCertificate(course, users)
  const participantQuery = gql`
    mutation updateParticipant($id: uuid!, $certificateId: uuid!) {
      update_course_participant(
        where: { id: { _eq: $id } }
        _set: { certificate_id: $certificateId, completed_evaluation: true }
      ) {
        affected_rows
      }
    }
  `
  try {
    const requests = users.map(async participant => {
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
    await Promise.all(requests)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const cancelCourse = async (
  courseId: number,
  cancellationReason = 'reason',
  cancellationFeePercent = 0
) => {
  try {
    await getClient().request<{
      update_course_participant: { affected_rows: number }
    }>(CANCEL_COURSE_MUTATION, {
      courseId,
      cancellationReason,
      cancellationFee: cancellationFeePercent,
    })
    console.log(`
      Cancelled the course "${courseId}" with the reason "${cancellationReason}"
    `)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const transferToCourse = async (
  fromCourseId: number,
  toCourseId: number,
  email: string,
  reason: string
): Promise<void> => {
  const participantId = await getCourseParticipantId(fromCourseId, email)
  const variables = {
    input: {
      fee: {
        type: TransferFeeType.ApplyTerms,
      },
      participantId: participantId,
      toCourseId: toCourseId,
      reason,
    },
  }
  const response: { transferParticipant: { success: string; error: string } } =
    await getClient().request<{
      transferParticipant: { success: string; error: string }
    }>(TRANSFER_PARTICIPANT, variables)
  if (response.transferParticipant.success) {
    console.log(
      `Transferred "${email}" from course "${fromCourseId}" to "${toCourseId}"`
    )
  } else {
    console.log(
      `Transfer failed due to "${response.transferParticipant.error}"`
    )
  }
}
