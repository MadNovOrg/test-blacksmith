import { Container, Box } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { CourseCertification } from '@app/components/CourseCertification'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'

export const CourseCertificationDetails = () => {
  const params = useParams()
  const { t } = useTranslation()
  const courseId = params.id as string
  const certificateId = params.certificateId as string

  return (
    <Container>
      <Box mt={1}>
        <BackButton
          to={`/courses/${courseId}/details?tab=${CourseDetailsTabs.CERTIFICATIONS}`}
          label={t('pages.course-grading-details.back-button-text')}
        />
      </Box>
      <Box mt={4}>
        <CourseCertification certificateId={certificateId} />
      </Box>
    </Container>
  )
}
