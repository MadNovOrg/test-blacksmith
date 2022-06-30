import { LoadingButton } from '@mui/lab'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { gql } from 'urql'

import { useAuth } from '@app/context/auth'
import { Promo_Code } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'

type Props = {
  promoCode: Partial<Promo_Code>
}

const APPROVE_CODE = gql`
  mutation ApproveCode($id: uuid!, $approvedBy: uuid) {
    update_promo_code_by_pk(
      pk_columns: { id: $id }
      _set: { approvedBy: $approvedBy }
    ) {
      id
    }
  }
`

const DENY_CODE = gql`
  mutation DenyCode($id: uuid!, $deniedBy: uuid) {
    update_promo_code_by_pk(
      pk_columns: { id: $id }
      _set: { deniedBy: $deniedBy }
    ) {
      id
    }
  }
`

export const ApproveDeny: React.FC<Props> = ({ promoCode }) => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { profile } = useAuth()

  const [loading, setLoading] = useState(false)

  const onApprove = async () => {
    setLoading(true)
    await fetcher(APPROVE_CODE, { id: promoCode.id, approvedBy: profile?.id })
    setLoading(false)
  }

  const onDeny = async () => {
    setLoading(true)
    await fetcher(DENY_CODE, { id: promoCode.id, deniedBy: profile?.id })
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
