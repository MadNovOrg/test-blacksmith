import { useCallback, useMemo } from 'react'
import useSWR from 'swr'
import * as yup from 'yup'

import { useFetcher } from '@app/hooks/use-fetcher'

import {
  QUERY,
  ResponseType,
  ParamsType,
} from '@app/queries/invites/get-course-invites'
import { MUTATION as SaveInvites } from '@app/queries/invites/save-course-invites'
import { MUTATION as RecreateInvite } from '@app/queries/invites/recreate-course-invite'
import { CourseInvite, InviteStatus, SortOrder } from '@app/types'
import { getSWRLoadingStatus } from '@app/util'

const emailsSchema = yup.array(yup.string().email().required()).min(1)

export default function useCourseInvites(
  courseId?: string,
  status?: InviteStatus,
  order?: SortOrder,
  limit?: number,
  offset?: number
) {
  const fetcher = useFetcher()

  const where = status ? { status: { _eq: status } } : undefined
  const orderBy = { email: order ? order : 'asc' }

  // Fetch course invites
  const {
    data,
    error,
    mutate: refetch,
  } = useSWR<ResponseType, Error, [string, ParamsType] | null>(
    courseId ? [QUERY, { courseId, where, orderBy, limit, offset }] : null
  )

  const invitedEmails = useMemo(() => {
    return data?.courseInvites.map(i => i.email) ?? []
  }, [data])

  // Save course invites
  const send = useCallback(
    async (emails: string[]) => {
      const allValid = await emailsSchema.isValid(emails)

      if (!allValid) {
        throw Error('INVALID_EMAILS')
      }

      const newEmails = emails.filter(
        email => invitedEmails?.includes(email) === false
      )
      if (!newEmails.length) {
        throw Error('EMAILS_ALREADY_INVITED')
      }

      const invites = newEmails.map(email => ({ course_id: courseId, email }))
      await fetcher(SaveInvites, { invites })
    },
    [fetcher, courseId, invitedEmails]
  )

  const resend = useCallback(
    async (invite: CourseInvite) => {
      await fetcher(RecreateInvite, {
        inviteId: invite.id,
        email: invite.email,
        courseId,
      })
    },
    [fetcher, courseId]
  )

  return useMemo(
    () => ({
      data: data?.courseInvites ?? [],
      total: data?.courseInvitesAggregate?.aggregate?.count ?? 0,
      status: getSWRLoadingStatus(data, error),
      error,
      send,
      resend,
      refetch,
    }),
    [data, error, send, resend, refetch]
  )
}
