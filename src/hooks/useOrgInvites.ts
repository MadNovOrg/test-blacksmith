import { useCallback, useMemo } from 'react'
import useSWR from 'swr'

import { useFetcher } from '@app/hooks/use-fetcher'
import { useMatchMutate } from '@app/hooks/useMatchMutate'
import { MUTATION as DELETE_ORG_INVITE_QUERY } from '@app/queries/invites/delete-org-invite'
import {
  ParamsType as GetOrgInvitesParamsType,
  QUERY as GET_ORG_INVITES_QUERY,
  ResponseType as GetOrgInvitesResponseType,
} from '@app/queries/invites/get-org-invites'
import { MUTATION as RESEND_ORG_INVITE_QUERY } from '@app/queries/invites/resend-org-invite'
import { Matcher } from '@app/queries/organization/get-org-details'
import { OrganizationInvite } from '@app/types'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

type Props = {
  limit?: number
  offset?: number
  where?: object
}

export const useOrgInvites = (
  orgId: string,
  { limit, offset, where }: Props
) => {
  const fetcher = useFetcher()
  const matchMutate = useMatchMutate()

  const { data, error, mutate } = useSWR<
    GetOrgInvitesResponseType,
    Error,
    [string, GetOrgInvitesParamsType] | null
  >(orgId ? [GET_ORG_INVITES_QUERY, { orgId, limit, offset, where }] : null)

  const status = getSWRLoadingStatus(data, error)

  const invalidateCache = useMemo(() => {
    return async () => {
      await mutate()
      await matchMutate(Matcher)
    }
  }, [matchMutate, mutate])

  const resend = useCallback(
    async (invite: OrganizationInvite) => {
      await fetcher(RESEND_ORG_INVITE_QUERY, {
        inviteId: invite.id,
      })
      await invalidateCache()
    },
    [fetcher, invalidateCache]
  )

  const cancel = useCallback(
    async (invite: OrganizationInvite) => {
      await fetcher(DELETE_ORG_INVITE_QUERY, {
        inviteId: invite.id,
      })
      await invalidateCache()
    },
    [fetcher, invalidateCache]
  )

  return useMemo(
    () => ({
      invites: data?.orgInvites ?? [],
      totalCount: data?.total.aggregate.count,
      resend,
      cancel,
      status,
      error,
      loading: status === LoadingStatus.FETCHING,
      mutate,
    }),
    [data, resend, cancel, status, error, mutate]
  )
}
