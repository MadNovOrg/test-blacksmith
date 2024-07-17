import { LoadingButton } from '@mui/lab'
import { Box } from '@mui/material'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  ApproveCodeMutation,
  ApproveCodeMutationVariables,
  DenyCodeMutation,
  DenyCodeMutationVariables,
  GetPromoCodesPendingApprovalQuery,
  GetPromoCodesQuery,
} from '@app/generated/graphql'
import { APPROVE_CODE, DENY_CODE } from '@app/queries/promo-codes/approve-deny'
import { GET_PROMOCODES_PENDING_APPROVAL } from '@app/queries/promo-codes/get-pending-approval'

type Props = {
  promoCode: GetPromoCodesQuery['promoCodes'][number]
  onAction: () => Promise<unknown> | void
}

export const ApproveDeny: React.FC<React.PropsWithChildren<Props>> = ({
  promoCode,
  onAction,
}) => {
  const { t } = useTranslation()
  const { profile } = useAuth()

  const [{ fetching: codeApprovalLoading }, getPromoCodes] =
    useQuery<GetPromoCodesPendingApprovalQuery>({
      query: GET_PROMOCODES_PENDING_APPROVAL,
    })

  const [, approveCode] = useMutation<
    ApproveCodeMutation,
    ApproveCodeMutationVariables
  >(APPROVE_CODE)

  const [{ fetching: codeDenialLoading }, denyCode] = useMutation<
    DenyCodeMutation,
    DenyCodeMutationVariables
  >(DENY_CODE)

  const reloadData = useCallback(async () => {
    getPromoCodes()
    await onAction()
  }, [getPromoCodes, onAction])

  const onApprove = async () => {
    try {
      await approveCode({ id: promoCode.id, approvedBy: profile?.id })
      await reloadData()
    } catch (err) {
      console.error((err as Error).message)
    }
  }

  const onDeny = async () => {
    try {
      await denyCode({ id: promoCode.id, deniedBy: profile?.id })
      await reloadData()
    } catch (err) {
      console.error((err as Error).message)
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <LoadingButton
        size="small"
        loading={codeApprovalLoading}
        onClick={onApprove}
      >
        {t('approve')}
      </LoadingButton>
      <LoadingButton size="small" loading={codeDenialLoading} onClick={onDeny}>
        {t('deny')}
      </LoadingButton>
    </Box>
  )
}
