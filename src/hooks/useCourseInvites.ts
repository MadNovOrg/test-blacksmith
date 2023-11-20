import { useCallback, useMemo } from 'react'
import useSWR from 'swr'
import * as yup from 'yup'

import { useFetcher } from '@app/hooks/use-fetcher'
import { useMatchMutate } from '@app/hooks/useMatchMutate'
import { MUTATION as CancelInvite } from '@app/queries/invites/cancel-course-invite'
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
  courseId?: number,
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
  const { data, error, mutate } = useSWR<
    ResponseType,
    Error,
    [string, ParamsType] | null
  >(courseId ? [QUERY, { courseId, where, orderBy, limit, offset }] : null)

  const invalidateCache = useMemo(() => {
    return async () => {
      await matchMutate(Matcher)
    }
  }, [matchMutate])

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

  // Save course invites
  const send = useCallback(
    async (emails: string[]) => {
      const recentData = await mutate()

      const declinedInvites =
        recentData?.courseInvites.filter(
          i => i.status === InviteStatus.DECLINED && emails.includes(i.email)
        ) ?? []

      const recentInvitesEmails =
        recentData?.courseInvites.map(i => i.email) ?? []

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

      await Promise.all(declinedInvites.map(i => resend(i)))

      const invites = newEmails.map(email => ({ course_id: courseId, email }))
      await fetcher(SaveInvites, { invites })

      await invalidateCache()
    },
    [mutate, fetcher, invalidateCache, resend, courseId]
  )

  const cancel = useCallback(
    async (invite: CourseInvite) => {
      await fetcher(CancelInvite, { inviteId: invite.id })
      await invalidateCache()
    },
    [fetcher, invalidateCache]
  )

  return useMemo(
    () => ({
      data: data?.courseInvites ?? [],
      total: data?.courseInvitesAggregate?.aggregate?.count ?? 0,
      status: getSWRLoadingStatus(data, error),
      error,
      send,
      resend,
      cancel,
      invalidateCache,
    }),
    [data, error, send, resend, cancel, invalidateCache]
  )
}
