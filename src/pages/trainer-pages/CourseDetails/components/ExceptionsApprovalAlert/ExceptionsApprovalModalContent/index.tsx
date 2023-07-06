import { Alert, Box, Button, TextField, useMediaQuery } from '@mui/material'
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  ApproveCourseMutation,
  ApproveCourseMutationVariables,
  Course_Audit_Insert_Input,
  Course_Audit_Type_Enum,
  Course_Status_Enum,
  InsertCourseAuditMutation,
  InsertCourseAuditMutationVariables,
  SetCourseStatusMutation,
  SetCourseStatusMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import { MUTATION as APPROVE_COURSE_MUTATION } from '@app/queries/courses/approve-course'
import { INSERT_COURSE_AUDIT } from '@app/queries/courses/insert-course-audit'
import { MUTATION as SET_COURSE_STATUS_MUTATION } from '@app/queries/courses/set-course-status'
import theme from '@app/theme'

type ExceptionsApprovalModalContentProps = {
  action:
    | Course_Audit_Type_Enum.Approved
    | Course_Audit_Type_Enum.Rejected
    | undefined
  courseId: string | undefined
  closeModal: () => void
}
export const ExceptionsApprovalModalContent: FC<
  ExceptionsApprovalModalContentProps
> = ({ action, courseId, closeModal }) => {
  const { t } = useTranslation()
  const { addSnackbarMessage } = useSnackbar()
  const fetcher = useFetcher()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [comment, setComment] = useState<string>('')
  const { data: course, mutate } = useCourse(courseId ?? '')
  const [{ error: auditError }, insertAudit] = useMutation<
    InsertCourseAuditMutation,
    InsertCourseAuditMutationVariables
  >(INSERT_COURSE_AUDIT)

  const addNewCourseAudit: (object: Course_Audit_Insert_Input) => void =
    useCallback(
      async object => {
        await insertAudit({ object })
      },
      [insertAudit]
    )

  const handleModalAction = useCallback(async () => {
    if (!course) return
    const auditObject = {
      type: action,
      course_id: course?.id,
      payload: { reason: comment },
      authorized_by: profile?.id,
    }

    try {
      if (action === Course_Audit_Type_Enum.Approved) {
        addNewCourseAudit(auditObject)
        await fetcher<ApproveCourseMutation, ApproveCourseMutationVariables>(
          APPROVE_COURSE_MUTATION,
          { courseId: course.id }
        )
        await mutate()
        addSnackbarMessage('course-approval-message', {
          label: t('pages.course-details.course-approval-message', {
            action: action.toLocaleLowerCase() ?? 'approved',
          }),
        })
      } else if (action === Course_Audit_Type_Enum.Rejected) {
        addNewCourseAudit(auditObject)
        await fetcher<
          SetCourseStatusMutation,
          SetCourseStatusMutationVariables
        >(SET_COURSE_STATUS_MUTATION, {
          id: course.id,
          status: Course_Status_Enum.Declined,
        })
        navigate('/')
      } else
        console.error(
          'Provided "action" prop is not of Course_Audit_Type_Enum type'
        )
    } catch (e: unknown) {
      console.error(e)
      closeModal()
      addSnackbarMessage('course-approval-error', {
        label: t('errors.generic.unknown-error-please-retry'),
      })
    }
  }, [
    course,
    action,
    comment,
    profile?.id,
    addNewCourseAudit,
    fetcher,
    mutate,
    addSnackbarMessage,
    t,
    navigate,
    closeModal,
  ])

  useEffect(() => {
    if (auditError) {
      addSnackbarMessage('course-approval-error', {
        label: t('errors.generic.unknown-error-please-retry'),
      })
    }
  }, [addSnackbarMessage, auditError, t])

  return (
    <>
      <Box data-testid="exceptions-approval-modal-content">
        <Box>
          <TextField
            fullWidth
            variant="filled"
            label={t('common.reason')}
            required
            value={comment}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setComment(e.target.value)
            }
          />
          {action === Course_Audit_Type_Enum.Rejected ? (
            <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
              {t('pages.create-course.exceptions.course-rejection-warning')}
            </Alert>
          ) : null}
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={isMobile ? 'column' : 'row'}
          sx={{ mt: 4 }}
        >
          <Button
            variant="text"
            fullWidth={isMobile}
            onClick={closeModal}
            sx={{ px: 4 }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            fullWidth={isMobile}
            onClick={handleModalAction}
            sx={{ px: 4 }}
          >
            {t('common.submit')}
          </Button>
        </Box>
      </Box>
    </>
  )
}
