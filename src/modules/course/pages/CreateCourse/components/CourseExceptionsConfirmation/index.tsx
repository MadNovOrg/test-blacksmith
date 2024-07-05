import {
  Alert,
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import { Course_Exception_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { shouldGoIntoExceptionApproval } from '@app/modules/course/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'

type Props = {
  open: boolean
  onCancel: () => void
  onSubmit: () => void
  exceptions: Course_Exception_Enum[]
  courseType?: Course_Type_Enum
  submitLabel?: string
}

export const CourseExceptionsConfirmation: React.FC<
  React.PropsWithChildren<Props>
> = ({ open, onCancel, onSubmit, exceptions, submitLabel, courseType }) => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const approvalRequired =
    !courseType || shouldGoIntoExceptionApproval(acl, courseType)

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      slots={{
        Title: () => (
          <Typography variant="h3" fontWeight={600}>
            {t(
              `pages.create-course.exceptions.${
                approvalRequired
                  ? 'course-approval-required'
                  : 'no-approval-required'
              }`,
            )}
          </Typography>
        ),
      }}
      maxWidth={600}
    >
      <Container sx={{ padding: isMobile ? 0 : 3 }}>
        <Alert severity="warning" variant="outlined">
          <Typography variant="body1" fontWeight={600}>
            {t(
              `pages.create-course.exceptions.${
                approvalRequired ? 'approval-header' : 'no-approval-header'
              }`,
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

        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          justifyContent="flex-end"
          my={4}
        >
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
            data-testid="proceed-button"
          >
            {submitLabel ?? t('pages.create-course.exceptions.proceed')}
          </Button>
        </Box>
      </Container>
    </Dialog>
  )
}
