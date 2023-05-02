import { Typography } from '@mui/material'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

export const GradingTitle: React.FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  return (
    <>
      <Typography variant="h2" mb={2}>
        {t('pages.course-grading.title')}
      </Typography>
      <Typography variant="h3" mb={5}>
        {children}
      </Typography>
    </>
  )
}
