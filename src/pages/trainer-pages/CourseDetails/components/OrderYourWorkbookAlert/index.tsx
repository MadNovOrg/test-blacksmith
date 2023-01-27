import { Alert, Link } from '@mui/material'
import { differenceInCalendarDays } from 'date-fns'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { Course_Status_Enum } from '@app/generated/graphql'
import { ResponseType } from '@app/queries/courses/get-course-by-id'
import { RoleName } from '@app/types'

type OrderYourWorkbookAlertProps = {
  course?: ResponseType['course']
}

export const OrderYourWorkbookAlert: React.FC<OrderYourWorkbookAlertProps> = ({
  course,
}) => {
  const { t } = useTranslation()
  const { activeRole } = useAuth()

  const isTrainer = activeRole === RoleName.TRAINER
  const isCourseScheduled = course?.status === Course_Status_Enum.Scheduled
  const today = new Date()
  const courseStartDate = course?.dates?.aggregate?.start.date
  const doesNotStartInAWeek =
    courseStartDate &&
    differenceInCalendarDays(new Date(courseStartDate), today) > 7

  if (isCourseScheduled && isTrainer && doesNotStartInAWeek) {
    return (
      <Alert
        severity="info"
        variant="outlined"
        sx={{
          mx: 3,
          my: 2,
        }}
      >
        <Trans t={t} i18nKey="pages.create-course.order-your-workbooks">
          <Link
            href="https://www.teamteachpublishing.co.uk/"
            target="_blank"
            component={'a'}
          />
        </Trans>
      </Alert>
    )
  }

  return null
}
