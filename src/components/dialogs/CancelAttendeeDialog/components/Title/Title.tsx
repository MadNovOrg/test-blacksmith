import { Typography } from '@mui/material'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

type TitleProps = {
  fullName: string
  courseCode: string
}

export const Title: React.FC<PropsWithChildren<TitleProps>> = ({
  fullName,
  courseCode,
}) => {
  const { t } = useTranslation()

  return (
    <Typography variant="h4" fontWeight={600}>
      {t('pages.individual-cancellation.title', {
        fullName,
        courseCode,
      })}
    </Typography>
  )
}
