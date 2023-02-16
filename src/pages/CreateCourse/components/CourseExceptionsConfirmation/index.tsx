import { Alert, Box, Button, Container, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'
import { useAuth } from '@app/context/auth'
import { CourseException } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import { RoleName } from '@app/types'

type Props = {
  open: boolean
  onCancel: () => void
  onSubmit: () => void
  exceptions: CourseException[]
  submitLabel?: string
}

export const CourseExceptionsConfirmation: React.FC<
  React.PropsWithChildren<Props>
> = ({ open, onCancel, onSubmit, exceptions, submitLabel }) => {
  const { t } = useTranslation()
  const { activeRole } = useAuth()
  const isAdmin = activeRole === RoleName.TT_ADMIN

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={
        <Typography variant="h3" fontWeight={600}>
          {t(
            `pages.create-course.exceptions.${
              isAdmin
                ? 'course-contains-exceptions'
                : 'course-approval-required'
            }`
          )}
        </Typography>
      }
      maxWidth={600}
    >
      <Container>
        <Alert severity="warning" variant="outlined">
          <Typography variant="body1" fontWeight={600}>
            {t(
              `pages.create-course.exceptions.${
                isAdmin ? 'admin-header' : 'warning-header'
              }`
            )}
          </Typography>
          <ul>
            {exceptions.map(exception => (
              <li key={exception}>
                {t(`pages.create-course.exceptions.type_${exception}`)}
              </li>
            ))}
          </ul>
        </Alert>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button
            type="button"
            variant="text"
            color="primary"
            onClick={onCancel}
          >
            {t('common.cancel')}
          </Button>

          <Button
            onClick={onSubmit}
            type="button"
            variant="contained"
            color="primary"
            sx={{ ml: 1 }}
          >
            {submitLabel ?? t('pages.create-course.exceptions.proceed')}
          </Button>
        </Box>
      </Container>
    </Dialog>
  )
}
