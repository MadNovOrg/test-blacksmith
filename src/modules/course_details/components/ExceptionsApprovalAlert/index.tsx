import { Alert, Box, Button, Typography, useMediaQuery } from '@mui/material'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Dialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import {
  Course_Status_Enum,
  Course_Audit_Type_Enum,
  Course_Exception_Enum,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import theme from '@app/theme'

import { ExceptionsApprovalModalContent } from '../ExceptionsApprovalModalContent'

export type ExceptionsApprovalModalAction =
  | Course_Audit_Type_Enum.Approved
  | Course_Audit_Type_Enum.Rejected

export const ExceptionsApprovalAlert: FC = () => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { id: courseId } = useParams()
  const { acl } = useAuth()
  const { data: courseInfo } = useCourse(courseId ?? '')
  const [commentsModalOpen, setCommentsModalOpen] = useState<boolean>(false)
  const [modalAction, setModalAction] = useState<ExceptionsApprovalModalAction>(
    Course_Audit_Type_Enum.Approved,
  )
  const [modalSubtitle, setModalSubtitle] = useState<string>('')

  const course = courseInfo?.course

  const exceptionsApprovalPending =
    course?.status === Course_Status_Enum.ExceptionsApprovalPending

  const ignoreExceptions =
    course && acl.isCourseAssistantTrainer(course)
      ? [Course_Exception_Enum.TrainerRatioNotMet]
      : []

  const courseExceptions =
    course?.courseExceptions
      ?.map(({ exception }) => exception)
      ?.filter(exception => !ignoreExceptions.includes(exception)) ?? []

  const handleModal: (
    action: Course_Audit_Type_Enum.Approved | Course_Audit_Type_Enum.Rejected,
  ) => void = action => {
    let subtitle = ''
    if (action === Course_Audit_Type_Enum.Approved) {
      subtitle = t('pages.create-course.exceptions.modal-subtitle-approve')
    } else if (action === Course_Audit_Type_Enum.Rejected) {
      subtitle = t('pages.create-course.exceptions.modal-subtitle-reject')
    }
    setModalAction(action)
    setModalSubtitle(subtitle)
    setCommentsModalOpen(true)
  }
  return exceptionsApprovalPending ? (
    <Alert
      data-testid="exceptions-approval"
      severity="warning"
      variant="outlined"
      sx={{
        my: 2,
        '&& .MuiAlert-message': {
          width: '100%',
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="stretch"
        gap={1}
        flexDirection={isMobile ? 'column' : 'row'}
      >
        <Box>
          <Typography variant="body1" fontWeight={600}>
            {t('pages.create-course.exceptions.approval-header', {
              count: courseExceptions.length,
            })}
          </Typography>
          {!!courseExceptions.length && (
            <ul>
              {courseExceptions.map(exception => (
                <li key={exception}>
                  {t(`pages.create-course.exceptions.type_${exception}`)}
                </li>
              ))}
            </ul>
          )}
          <Typography variant="body1" fontWeight={600}>
            {t('pages.create-course.exceptions.approval-footer')}
          </Typography>
        </Box>
        {acl.canApproveCourseExceptions() ? (
          <>
            <Box
              display="flex"
              flexDirection={isMobile ? 'column' : 'row'}
              alignItems="center"
            >
              <Button
                variant="text"
                fullWidth={isMobile}
                onClick={() => handleModal(Course_Audit_Type_Enum.Rejected)}
                sx={{ px: 2 }}
              >
                {t('common.reject')}
              </Button>
              <Button
                variant="contained"
                fullWidth={isMobile}
                onClick={() => handleModal(Course_Audit_Type_Enum.Approved)}
                sx={{ px: 7 }}
              >
                {t('common.approve')}
              </Button>
            </Box>
            <Dialog
              subtitle={modalSubtitle}
              open={commentsModalOpen}
              onClose={() => setCommentsModalOpen(false)}
            >
              <ExceptionsApprovalModalContent
                action={modalAction}
                courseId={courseId}
                closeModal={() => setCommentsModalOpen(false)}
              />
            </Dialog>
          </>
        ) : null}
      </Box>
    </Alert>
  ) : null
}
