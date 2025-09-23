import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { To, useNavigate } from 'react-router-dom'

type BackButtonProps = {
  label?: string
  to?: string
  replace?: boolean
}

export const BackButton: React.FC<BackButtonProps> = ({
  label,
  to,
  replace = false,
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Button
      onClick={() => navigate(to ?? (-1 as To), { replace })}
      variant="text"
      startIcon={<ArrowBackIcon />}
    >
      {label || t('back')}
    </Button>
  )
}
