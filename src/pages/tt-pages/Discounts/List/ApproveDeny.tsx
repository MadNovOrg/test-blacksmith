import { LoadingButton } from '@mui/lab'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { Promo_Code } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { APPROVE_CODE, DENY_CODE } from '@app/queries/promo-codes/approve-deny'

type Props = {
  promoCode: Partial<Promo_Code>
}

export const ApproveDeny: React.FC<Props> = ({ promoCode }) => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { profile } = useAuth()

  const [loading, setLoading] = useState(false)

  const onApprove = async () => {
    setLoading(true)
    try {
      await fetcher(APPROVE_CODE, { id: promoCode.id, approvedBy: profile?.id })
    } catch (err) {
      console.error((err as Error).message)
    }
    setLoading(false)
  }

  const onDeny = async () => {
    setLoading(true)
    try {
      await fetcher(DENY_CODE, { id: promoCode.id, deniedBy: profile?.id })
    } catch (err) {
      console.error((err as Error).message)
    }
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
