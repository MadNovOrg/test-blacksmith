import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { UnverifiedLayout } from '@app/components/UnverifiedLayout'

import { Form } from './components/Form'

export const CourseBookingPage: React.FC = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const courseId = searchParams.get('course_id')
  console.log(courseId)

  return (
    <UnverifiedLayout width={628}>
      {t('booking')}
      <Form />
    </UnverifiedLayout>
  )
}
