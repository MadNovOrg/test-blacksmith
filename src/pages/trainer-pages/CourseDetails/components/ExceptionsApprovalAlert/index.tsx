import { Alert, Box, Button, Typography, useMediaQuery } from '@mui/material'
import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Dialog } from '@app/components/Dialog'
import { useAuth } from '@app/context/auth'
import {
  Course_Status_Enum,
  CourseTrainerType,
  Course_Audit_Type_Enum,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { checkCourseDetailsForExceptions } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import theme from '@app/theme'
import { CourseLevel, TrainerRoleTypeName } from '@app/types'
import { bildStrategiesToRecord } from '@app/util'

import { ExceptionsApprovalModalContent } from './ExceptionsApprovalModalContent'

export type ExceptionsApprovalModalAction =
  | Course_Audit_Type_Enum.Approved
  | Course_Audit_Type_Enum.Rejected

export const ExceptionsApprovalAlert: FC = () => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { id: courseId } = useParams()
  const { acl } = useAuth()
  const { data: course } = useCourse(courseId ?? '')
  const [commentsModalOpen, setCommentsModalOpen] = useState<boolean>(false)
  const [modalAction, setModalAction] = useState<ExceptionsApprovalModalAction>(
    Course_Audit_Type_Enum.Approved
  )
  const [modalSubtitle, setModalSubtitle] = useState<string>('')

  const exceptionsApprovalPending =
    course?.status === Course_Status_Enum.ExceptionsApprovalPending

  const leader = course?.trainers?.find(
    c => c.type === CourseTrainerType.Leader
  )

  const courseExceptions = useMemo(() => {
    if (!course || !course.trainers || !exceptionsApprovalPending) return []

    return checkCourseDetailsForExceptions(
      {
        startDateTime: new Date(course.dates?.aggregate?.start?.date),
        courseLevel: course.level,
        maxParticipants: course.max_participants,
        modulesDuration: course.modulesDuration,
        type: course.type,
        deliveryType: course.deliveryType,
        reaccreditation: course.reaccreditation ?? false,
        conversion: course.conversion,
        accreditedBy: course.accreditedBy,
        bildStrategies: bildStrategiesToRecord(course.bildStrategies),
        hasSeniorOrPrincipalLeader:
          (leader &&
            leader.profile.trainer_role_types.some(
              ({ trainer_role_type: role }) =>
                role.name === TrainerRoleTypeName.SENIOR ||
                role.name === TrainerRoleTypeName.PRINCIPAL
            )) ??
          false,
      },
      course.trainers.map(t => ({
        type: t.type,
        trainer_role_types: t.profile.trainer_role_types,
        levels: (t.profile.certificates ?? []).map(c => ({
          courseLevel: c.courseLevel as CourseLevel,
          expiryDate: c.expiryDate,
        })),
      }))
    )
  }, [course, exceptionsApprovalPending, leader])

  const handleModal: (
    action: Course_Audit_Type_Enum.Approved | Course_Audit_Type_Enum.Rejected
  ) => void = action => {
    setModalAction(action)
    setModalSubtitle(
      action === Course_Audit_Type_Enum.Approved
        ? t('pages.create-course.exceptions.modal-subtitle-approve')
        : action === Course_Audit_Type_Enum.Rejected
        ? t('pages.create-course.exceptions.modal-subtitle-reject')
        : ''
    )
    setCommentsModalOpen(true)
  }
  return (
    <>
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
              {t('pages.create-course.exceptions.approval-header')}
            </Typography>
            <ul>
              {courseExceptions.map(exception => (
                <li key={exception}>
                  {t(`pages.create-course.exceptions.type_${exception}`)}
                </li>
              ))}
            </ul>
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
    </>
  )
}
