import React from 'react'
import { To, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next'

type BackButtonProps = {
  label?: string
  to?: string
}

export const BackButton: React.FC<BackButtonProps> = ({ label, to }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Button
      onClick={() => navigate(to ?? (-1 as To))}
      variant="text"
      startIcon={<ArrowBackIcon />}
    >
      {label || t('back')}
    </Button>
  )
}
