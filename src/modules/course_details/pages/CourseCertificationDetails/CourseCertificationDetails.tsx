import { Container, Box } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'

import { CourseCertification } from '../../course_certification_tab/pages/CourseCertification/CourseCertification'

export const CourseCertificationDetails = () => {
  const params = useParams()
  const { t } = useTranslation()
  const certificateId = params.certificateId as string

  return (
    <Container>
      <Helmet>
        <title>
          {t('pages.browser-tab-titles.user-profile.certifications')}
        </title>
      </Helmet>
      <Box mt={1}>
        <BackButton label={t('common.back')} />
      </Box>
      <Box mt={4}>
        <CourseCertification certificateId={certificateId} />
      </Box>
    </Container>
  )
}
