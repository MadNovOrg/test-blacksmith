import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next'

type BackButtonProps = {
  label?: string
}

export const BackButton: React.FC<BackButtonProps> = ({ label }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Button
      onClick={() => navigate(-1)}
      variant="text"
      startIcon={<ArrowBackIcon />}
    >
      {label || t('back')}
    </Button>
  )
}
