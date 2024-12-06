import { differenceInSeconds } from 'date-fns'
import { isPast } from 'date-fns'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { gql, useMutation, useQuery } from 'urql'
import isEmail from 'validator/lib/isEmail'
import * as yup from 'yup'

import {
  CancelCourseInviteMutation,
  CancelCourseInviteMutationVariables,
  Course_Invite_Status_Enum,
  Course_Invites_Order_By,
  Course_Type_Enum,
  GetCourseInvitesQuery,
  GetCourseInvitesQueryVariables,
  SaveCourseInvitesMutation,
  SaveCourseInvitesMutationVariables,
  SaveIndirectBlCourseInvitesMutation,
  SaveIndirectBlCourseInvitesMutationVariables,
  SendCourseInvitesMutation,
  SendCourseInvitesMutationVariables,
  SendIndirectBlCourseInvitesError,
} from '@app/generated/graphql'
import usePollQuery from '@app/hooks/usePollQuery'
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
      createdAt
      email
      expiresIn
      inviter_id
      note
      status
    }
    courseInvitesAggregate: course_invites_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`

export const SEND_COURSE_INVITES = gql`
  mutation SendCourseInvites($invites: [course_invites_insert_input!]!) {
    insert_course_invites(
      objects: $invites
      on_conflict: {
        constraint: course_invites_email_course_id_key
        update_columns: [createdAt, inviter_id, status]
      }
    ) {
      returning {
        id
      }
    }
  }
`

export const CANCEL_COURSE_INVITE = gql`
  mutation CancelCourseInvite($inviteId: uuid!) {
    update_course_invites_by_pk(
      pk_columns: { id: $inviteId }
      _set: { status: CANCELLED }
    ) {
      id
    }
  }
`

export const SAVE_COURSE_INVITES = gql`
  mutation SaveCourseInvites($invites: [course_invites_insert_input!]!) {
    insert_course_invites(objects: $invites) {
      returning {
        id
      }
    }
  }
`

export const SAVE_INDIRECT_BL_COURSE_INVITES = gql`
  mutation SaveIndirectBLCourseInvites(
    $input: SendIndirectBLCourseInvitesInput!
  ) {
    sendIndirectBLCourseInvites(input: $input) {
      insufficientNumberOfLicenses
      error
      success
    }
  }
`

const emailsSchema = yup
  .array(
    yup
      .string()
      .email()
      .required()
      .test('is-email', email => {
        return isEmail(email)
      }),
  )
  .min(1)

export default function useCourseInvites({
  courseId,
  courseEnd,
  inviter,
  limit,
  offset,
  order,
  poll,
  status,
}: {
  courseId: number
  courseEnd?: string
  inviter: string | null
  limit?: number
  offset?: number
  order?: SortOrder
  poll?: {
    untilInvitees: string[]
  }
  status?: Course_Invite_Status_Enum
}) {
  const navigate = useNavigate()

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

  const pollingUntil = useCallback(() => {
    if (!poll?.untilInvitees.length) return true

    return (
      poll?.untilInvitees.every(invitee =>
        (invitesData?.courseInvites ?? []).some(
          i =>
            i.email?.trim().toLocaleLowerCase() ===
            invitee.trim().toLocaleLowerCase(),
        ),
      ) ?? true
    )
  }, [invitesData?.courseInvites, poll?.untilInvitees])

  const [startPolling, pollRunning] = usePollQuery(
    () => {
      getInvites({ fetchPolicy: 'network-only' })
    },
    pollingUntil,
    {
      interval: 2000,
      maxPolls: 5,
    },
  )

  const [, sendInvites] = useMutation<
    SendCourseInvitesMutation,
    SendCourseInvitesMutationVariables
  >(SEND_COURSE_INVITES)

  const [, saveInvites] = useMutation<
    SaveCourseInvitesMutation,
    SaveCourseInvitesMutationVariables
  >(SAVE_COURSE_INVITES)

  const [, saveIndirectBLCourseInvites] = useMutation<
    SaveIndirectBlCourseInvitesMutation,
    SaveIndirectBlCourseInvitesMutationVariables
  >(SAVE_INDIRECT_BL_COURSE_INVITES)

  const [, cancelInvite] = useMutation<
    CancelCourseInviteMutation,
    CancelCourseInviteMutationVariables
  >(CANCEL_COURSE_INVITE)

  const getExpiresInDateForInviteResend = useCallback(() => {
    /**
     * @description This "expires in" date serves as a placeholder (for UI updates) for the actual
     * expiration date, which will be updated based on the invite token.
     * @author ion.mereuta@amdaris.com
     * @see https://behaviourhub.atlassian.net/jira/software/projects/TTHP/issues/TTHP-3429
     */
    const ONE_WEEK_IN_SECONDS = 604800 // 604800 seconds = 1 week

    const secondsUntilWeekAfterCourseEnded = courseEnd
      ? differenceInSeconds(
          new Date(
            new Date(courseEnd).setDate(new Date(courseEnd).getDate() + 7),
          ),
          new Date(),
        )
      : 0

    const expiresInSeconds = Math.max(
      ONE_WEEK_IN_SECONDS,
      secondsUntilWeekAfterCourseEnded,
    )

    const expiresInDate = new Date(
      new Date().setSeconds(new Date().getSeconds() + expiresInSeconds),
    )

    return expiresInDate
  }, [courseEnd])

  const resend = useCallback(
    async (invite: GetCourseInvitesQuery['courseInvites'][0]) => {
      await sendInvites({
        invites: [
          {
            course_id: courseId,
            email: invite.email,
            expiresIn: getExpiresInDateForInviteResend(),
            status: Course_Invite_Status_Enum.Pending,
            inviter_id: [
              Course_Invite_Status_Enum.Cancelled,
              Course_Invite_Status_Enum.Declined,
            ].includes(invite.status as Course_Invite_Status_Enum)
              ? inviter
              : invite.inviter_id,
          },
        ],
      })
    },
    [courseId, getExpiresInDateForInviteResend, inviter, sendInvites],
  )

  // Save course invites
  const send = useCallback(
    async ({
      emails,
      course,
    }: {
      emails: string[]
      course: { go1Integration: boolean; type: Course_Type_Enum }
    }) => {
      const declinedInvites =
        invitesData?.courseInvites.filter(
          i =>
            [
              Course_Invite_Status_Enum.Cancelled,
              Course_Invite_Status_Enum.Declined,
            ].includes(i.status as Course_Invite_Status_Enum) &&
            emails.includes(i.email as string),
        ) ?? []

      const recentInvitesEmails = (
        invitesData?.courseInvites.map(i => i.email as string) ?? []
      ).filter(invitee => !declinedInvites.some(i => i.email === invitee))

      const allValid = await emailsSchema.isValid(emails)

      if (!allValid) {
        throw Error('INVALID_EMAILS')
      }

      const newEmails = emails.filter(
        email =>
          recentInvitesEmails?.includes(email) === false &&
          !declinedInvites.some(i => i.email === email),
      )

      if (
        recentInvitesEmails.some(recentInviteeEmail =>
          emails.includes(recentInviteeEmail),
        ) &&
        (newEmails.length || declinedInvites?.length)
      ) {
        throw Error('SOME_EMAILS_ALREADY_INVITED')
      }

      if (!newEmails.length && !declinedInvites?.length) {
        throw Error('EMAILS_ALREADY_INVITED')
      }

      if (
        !(course.go1Integration && course.type === Course_Type_Enum.Indirect)
      ) {
        await Promise.all(declinedInvites.map(invite => resend(invite)))
      }

      const invitedAfterCourseHasEnded = courseEnd
        ? isPast(new Date(courseEnd))
        : false

      const invites = newEmails.map(email => ({
        course_id: courseId,
        email,
        invited_after_course_end: invitedAfterCourseHasEnded,
        inviter_id: inviter,
      }))

      if (course.go1Integration && course.type === Course_Type_Enum.Indirect) {
        const actionInvitesData = [
          ...newEmails.map(email => ({
            email,
            invitedAfterCourseHasEnded,
            inviter_id: inviter,
          })),
          ...declinedInvites
            .filter(invite => Boolean(invite.email))
            .map(invite => ({
              email: invite.email as string,
              expiresIn: getExpiresInDateForInviteResend().toISOString(),
              invitedAfterCourseHasEnded,
              inviter_id: inviter,
              status: Course_Invite_Status_Enum.Pending,
            })),
        ]

        const resp = await saveIndirectBLCourseInvites({
          input: {
            courseId,
            invites: actionInvitesData,
          },
        })

        if (
          !resp.data?.sendIndirectBLCourseInvites?.success &&
          resp.data?.sendIndirectBLCourseInvites?.error ===
            SendIndirectBlCourseInvitesError.InsufficientNumberOfLicenses &&
          (resp.data.sendIndirectBLCourseInvites.insufficientNumberOfLicenses ??
            0)
        ) {
          navigate(`/courses/edit/${courseId}/review-licenses-order`, {
            state: {
              insufficientNumberOfLicenses: resp.data
                .sendIndirectBLCourseInvites
                .insufficientNumberOfLicenses as number,
              invitees: actionInvitesData,
            },
          })
        }
      } else {
        await saveInvites({ invites })
      }
    },
    [
      invitesData?.courseInvites,
      courseEnd,
      resend,
      courseId,
      inviter,
      saveIndirectBLCourseInvites,
      getExpiresInDateForInviteResend,
      navigate,
      saveInvites,
    ],
  )

  const cancel = useCallback(
    async (invite: GetCourseInvitesQuery['courseInvites'][0]) => {
      await cancelInvite({ inviteId: invite.id })
    },
    [cancelInvite],
  )

  return useMemo(
    () => ({
      cancel,
      data: invitesData?.courseInvites ?? [],
      error: invitesError,
      fetching: invitesFetching,
      getInvites,
      pollRunning,
      resend,
      send,
      startPolling,
      total: invitesData?.courseInvitesAggregate?.aggregate?.count ?? 0,
    }),
    [
      cancel,
      getInvites,
      invitesData?.courseInvites,
      invitesData?.courseInvitesAggregate?.aggregate?.count,
      invitesError,
      invitesFetching,
      pollRunning,
      resend,
      send,
      startPolling,
    ],
  )
}
