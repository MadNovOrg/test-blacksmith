import { LoadingButton } from '@mui/lab'
import { Box } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { useAuth } from '@app/context/auth'
import {
  GetPromoCodesPendingApprovalQuery,
  GetPromoCodesQuery,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { APPROVE_CODE, DENY_CODE } from '@app/queries/promo-codes/approve-deny'
import { QUERY } from '@app/queries/promo-codes/get-pending-approval'

type Props = {
  promoCode: GetPromoCodesQuery['promoCodes'][number]
  onAction: () => Promise<unknown>
}

export const ApproveDeny: React.FC<React.PropsWithChildren<Props>> = ({
  promoCode,
  onAction,
}) => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { profile } = useAuth()

  const [loading, setLoading] = useState(false)
  const { mutate } = useSWR<GetPromoCodesPendingApprovalQuery, Error>([QUERY])

  const reloadData = useCallback(async () => {
    await mutate()
    await onAction()
  }, [mutate, onAction])

  const onApprove = async () => {
    setLoading(true)
    try {
      await fetcher(APPROVE_CODE, { id: promoCode.id, approvedBy: profile?.id })
    } catch (err) {
      console.error((err as Error).message)
    }
    await reloadData()
    setLoading(false)
  }

  const onDeny = async () => {
    setLoading(true)
    try {
      await fetcher(DENY_CODE, { id: promoCode.id, deniedBy: profile?.id })
    } catch (err) {
      console.error((err as Error).message)
    }
    await reloadData()
    setLoading(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <LoadingButton size="small" loading={loading} onClick={onApprove}>
        {t('approve')}
      </LoadingButton>
      <LoadingButton size="small" loading={loading} onClick={onDeny}>
        {t('deny')}
      </LoadingButton>
    </Box>
  )
}
