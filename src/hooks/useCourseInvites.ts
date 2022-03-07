import { useCallback, useMemo } from 'react'
import useSWR from 'swr'
import * as yup from 'yup'

import { useFetcher } from '@app/hooks/use-fetcher'

import { QUERY, ResponseType } from '@app/queries/invites/get-course-invites'
import { QUERY as SaveInvites } from '@app/queries/invites/save-course-invites'

const emailsSchema = yup.array(yup.string().email().required()).min(1)

export default function useCourseInvites(courseId?: string) {
  const fetcher = useFetcher()

  // Fetch course invites
  const {
    data,
    error,
    mutate: refetch,
  } = useSWR<ResponseType, Error, [string, { courseId: string }] | null>(
    courseId ? [QUERY, { courseId }] : null
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

  return useMemo(
    () => ({
      list: data?.courseInvites ?? [],
      total: data?.courseInvitesAggregate?.aggregate?.count ?? 0,
      error,
      send,
      refetch,
    }),
    [data, error, send, refetch]
  )
}
