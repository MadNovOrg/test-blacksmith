import { useCallback, useMemo } from 'react'
import useSWR from 'swr'
import * as yup from 'yup'

import { useFetcher } from '@app/hooks/use-fetcher'
import { useMatchMutate } from '@app/hooks/useMatchMutate'
import {
  QUERY,
  Matcher,
  ResponseType,
  ParamsType,
} from '@app/queries/invites/get-course-invites'
import { MUTATION as RecreateInvite } from '@app/queries/invites/recreate-course-invite'
import { MUTATION as SaveInvites } from '@app/queries/invites/save-course-invites'
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
  const matchMutate = useMatchMutate()

  const where = status ? { status: { _eq: status } } : undefined
  const orderBy = { email: order ? order : 'asc' }

  // Fetch course invites
  const { data, error } = useSWR<
    ResponseType,
    Error,
    [string, ParamsType] | null
  >(courseId ? [QUERY, { courseId, where, orderBy, limit, offset }] : null)

  const invalidateCache = useMemo(() => {
    return async () => {
      await matchMutate(Matcher)
    }
  }, [matchMutate])

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
      await invalidateCache()
    },
    [fetcher, invalidateCache, invitedEmails, courseId]
  )

  const resend = useCallback(
    async (invite: CourseInvite) => {
      await fetcher(RecreateInvite, {
        inviteId: invite.id,
        email: invite.email,
        courseId,
      })
      await invalidateCache()
    },
    [fetcher, courseId, invalidateCache]
  )

  return useMemo(
    () => ({
      data: data?.courseInvites ?? [],
      total: data?.courseInvitesAggregate?.aggregate?.count ?? 0,
      status: getSWRLoadingStatus(data, error),
      error,
      send,
      resend,
      invalidateCache,
    }),
    [data, error, send, resend, invalidateCache]
  )
}
