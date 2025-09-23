import { useCallback, useMemo } from 'react'
import { gql, useMutation, useQuery } from 'urql'

import {
  DeleteOrgInviteMutation,
  DeleteOrgInviteMutationVariables,
  GetOrgInvitesQuery,
  GetOrgInvitesQueryVariables,
  RecreateOrgInviteMutation,
  RecreateOrgInviteMutationVariables,
} from '@app/generated/graphql'
import { PROFILE } from '@app/queries/fragments'

export const GET_ORG_INVITES = gql`
  ${PROFILE}
  query GetOrgInvites(
    $orgId: uuid!
    $limit: Int = 20
    $offset: Int = 0
    $where: organization_invites_bool_exp = {}
  ) {
    orgInvites: organization_invites(
      where: { _and: [{ orgId: { _eq: $orgId } }, $where] }
      limit: $limit
      offset: $offset
      order_by: { createdAt: desc }
    ) {
      id
      createdAt
      updatedAt
      email
      status
      isAdmin
      profile {
        ...Profile
      }
      organization {
        ...Organization
      }
    }
    total: organization_invites_aggregate(
      where: { _and: [{ orgId: { _eq: $orgId } }, $where] }
    ) {
      aggregate {
        count
      }
    }
  }
`
export const DELETE_ORG_INVITE = gql`
  mutation DeleteOrgInvite($inviteId: uuid!) {
    delete_organization_invites_by_pk(id: $inviteId) {
      id
    }
  }
`
export const RESEND_ORG_INVITE = gql`
  mutation RecreateOrgInvite($inviteId: uuid!) {
    update_organization_invites_by_pk(
      pk_columns: { id: $inviteId }
      _set: { updatedAt: "now()" }
    ) {
      id
    }
  }
`

type Props = {
  limit?: number
  offset?: number
  where?: object
}

export const useOrgInvites = (
  orgId: string,
  { limit, offset, where }: Props,
) => {
  const [{ data, error, fetching }, mutate] = useQuery<
    GetOrgInvitesQuery,
    GetOrgInvitesQueryVariables
  >({
    query: GET_ORG_INVITES,
    variables: { orgId, limit, offset, where },
  })

  const [, resendOrgInvite] = useMutation<
    RecreateOrgInviteMutation,
    RecreateOrgInviteMutationVariables
  >(RESEND_ORG_INVITE)

  const [, deleteOrgInvite] = useMutation<
    DeleteOrgInviteMutation,
    DeleteOrgInviteMutationVariables
  >(DELETE_ORG_INVITE)

  const resend = useCallback(
    async (inviteId: string) => {
      await resendOrgInvite({
        inviteId: inviteId,
      })
      mutate()
    },
    [mutate, resendOrgInvite],
  )

  const cancel = useCallback(
    async (inviteId: string) => {
      await deleteOrgInvite({
        inviteId: inviteId,
      })
      mutate()
    },
    [deleteOrgInvite, mutate],
  )

  return useMemo(
    () => ({
      invites: data?.orgInvites ?? [],
      totalCount: data?.total.aggregate?.count ?? 0,
      resend,
      cancel,
      error,
      loading: fetching,
      mutate,
    }),
    [
      data?.orgInvites,
      data?.total.aggregate?.count,
      resend,
      cancel,
      error,
      fetching,
      mutate,
    ],
  )
}
