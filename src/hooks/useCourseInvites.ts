import { differenceInSeconds } from 'date-fns'
import { isPast } from 'date-fns'
import { useCallback, useMemo } from 'react'
import { gql, useMutation, useQuery } from 'urql'
import * as yup from 'yup'

import {
  CancelCourseInviteMutation,
  CancelCourseInviteMutationVariables,
  Course_Invite_Status_Enum,
  Course_Invites_Order_By,
  GetCourseInvitesQuery,
  GetCourseInvitesQueryVariables,
  RecreateCourseInviteMutation,
  RecreateCourseInviteMutationVariables,
  SaveCourseInvitesMutation,
  SaveCourseInvitesMutationVariables,
} from '@app/generated/graphql'
import { SortOrder } from '@app/types'

export const GET_COURSE_INVITES = gql`
  query GetCourseInvites(
    $limit: Int
    $offset: Int = 0
    $where: course_invites_bool_exp = {}
    $orderBy: [course_invites_order_by!] = { email: asc }
  ) {
    courseInvites: course_invites(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $orderBy
    ) {
      id
      email
      status
      createdAt
      note
      expiresIn
    }
    courseInvitesAggregate: course_invites_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`

export const RECREATE_COURSE_INVITE = gql`
  mutation RecreateCourseInvite(
    $inviteId: uuid!
    $courseId: Int
    $email: String
    $expiresIn: timestamptz
  ) {
    delete_course_invites_by_pk(id: $inviteId) {
      id
    }
    insert_course_invites_one(
      object: { course_id: $courseId, email: $email, expiresIn: $expiresIn }
    ) {
      id
    }
  }
`

export const SAVE_INVITE = gql`
  mutation SaveCourseInvites($invites: [course_invites_insert_input!]!) {
    insert_course_invites(objects: $invites) {
      returning {
        id
      }
    }
  }
`
export const CANCEL_INVITE = gql`
  mutation CancelCourseInvite($inviteId: uuid!) {
    delete_course_invites_by_pk(id: $inviteId) {
      id
    }
  }
`

const emailsSchema = yup.array(yup.string().email().required()).min(1)

export default function useCourseInvites({
  courseId,
  status,
  order,
  limit,
  offset,
  courseEnd,
}: {
  courseId: number
  status?: Course_Invite_Status_Enum
  order?: SortOrder
  limit?: number
  offset?: number
  courseEnd?: string
}) {
  const where = {
    _and: [
      { course_id: { _eq: courseId } },
      ...(status ? [{ status: { _eq: status } }] : [{}]),
    ],
  }
  const orderBy = { email: order ? order : 'asc' } as Course_Invites_Order_By

  // Fetch course invites
  const [
    { data: invitesData, error: invitesError, fetching: invitesFetching },
    getInvites,
  ] = useQuery<GetCourseInvitesQuery, GetCourseInvitesQueryVariables>({
    query: GET_COURSE_INVITES,
    variables: { where, orderBy, limit, offset },
    pause: !courseId,
    requestPolicy: 'cache-and-network',
  })

  const [, recreateCourseInvite] = useMutation<
    RecreateCourseInviteMutation,
    RecreateCourseInviteMutationVariables
  >(RECREATE_COURSE_INVITE)

  const [, saveInvites] = useMutation<
    SaveCourseInvitesMutation,
    SaveCourseInvitesMutationVariables
  >(SAVE_INVITE)

  const [, cancelInvite] = useMutation<
    CancelCourseInviteMutation,
    CancelCourseInviteMutationVariables
  >(CANCEL_INVITE)

  const resend = useCallback(
    async (invite: GetCourseInvitesQuery['courseInvites'][0]) => {
      /**
       * @description This expires in data is a placeholder (for UI update) for the actual
       * expires in date which will be updates accordingly to invite token
       * @author ion.mereuta@amdaris.com
       * @see https://behaviourhub.atlassian.net/jira/software/projects/TTHP/issues/TTHP-3429
       */
      const ONE_WEEK_IN_SECONDS = 604800 // 604800 seconds = 1 week

      const secondsUntilWeekAfterCourseEnded = courseEnd
        ? differenceInSeconds(
            new Date(
              new Date(courseEnd).setDate(new Date(courseEnd).getDate() + 7)
            ),
            new Date()
          )
        : 0

      const expiresInSeconds = Math.max(
        ONE_WEEK_IN_SECONDS,
        secondsUntilWeekAfterCourseEnded
      )

      const expiresInDate = new Date(
        new Date().setSeconds(new Date().getSeconds() + expiresInSeconds)
      )

      await recreateCourseInvite({
        inviteId: invite.id,
        email: invite.email,
        courseId,
        expiresIn: expiresInDate,
      })
    },
    [courseEnd, courseId, recreateCourseInvite]
  )

  // Save course invites
  const send = useCallback(
    async (emails: string[]) => {
      const declinedInvites =
        invitesData?.courseInvites.filter(
          i =>
            i.status === Course_Invite_Status_Enum.Declined &&
            emails.includes(i.email as string)
        ) ?? []

      const recentInvitesEmails =
        invitesData?.courseInvites.map(i => i.email) ?? []

      const allValid = await emailsSchema.isValid(emails)

      if (!allValid) {
        throw Error('INVALID_EMAILS')
      }

      const newEmails = emails.filter(
        email =>
          recentInvitesEmails?.includes(email) === false &&
          !declinedInvites.some(i => i.email === email)
      )

      if (!newEmails.length && !declinedInvites?.length) {
        throw Error('EMAILS_ALREADY_INVITED')
      }

      await Promise.all(declinedInvites.map(invite => resend(invite)))

      const invites = newEmails.map(email => ({
        course_id: courseId,
        email,
        invited_after_course_end: courseEnd
          ? isPast(new Date(courseEnd))
          : false,
      }))

      await saveInvites({ invites })
    },
    [invitesData?.courseInvites, saveInvites, resend, courseId, courseEnd]
  )

  const cancel = useCallback(
    async (invite: GetCourseInvitesQuery['courseInvites'][0]) => {
      await cancelInvite({ inviteId: invite.id })
    },
    [cancelInvite]
  )

  return useMemo(
    () => ({
      data: invitesData?.courseInvites ?? [],
      total: invitesData?.courseInvitesAggregate?.aggregate?.count ?? 0,
      fetching: invitesFetching,
      error: invitesError,
      send,
      resend,
      cancel,
      getInvites,
    }),
    [
      invitesData?.courseInvites,
      invitesData?.courseInvitesAggregate?.aggregate?.count,
      invitesFetching,
      invitesError,
      send,
      resend,
      cancel,
      getInvites,
    ]
  )
}
