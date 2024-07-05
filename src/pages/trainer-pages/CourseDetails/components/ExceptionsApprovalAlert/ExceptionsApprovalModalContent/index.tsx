import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Box, Button, TextField, useMediaQuery } from '@mui/material'
import { FC, useCallback, useEffect, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { useSnackbar } from '@app/context/snackbar'
import {
  ApproveCourseMutation,
  ApproveCourseMutationVariables,
  Course_Audit_Type_Enum,
  RejectCourseMutation,
  RejectCourseMutationVariables,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { APPROVE_COURSE_MUTATION } from '@app/queries/courses/approve-course'
import { REJECT_COURSE_MUTATION } from '@app/queries/courses/reject-course'
import { yup } from '@app/schemas'
import theme from '@app/theme'

import { ExceptionsApprovalModalAction } from '..'

type WarningAlertProps = {
  action: ExceptionsApprovalModalAction
}

const WarningAlert = ({ action }: WarningAlertProps) => {
  const { t } = useTranslation()

  if (action === Course_Audit_Type_Enum.Rejected)
    return (
      <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
        {t('pages.create-course.exceptions.course-rejection-warning')}
      </Alert>
    )
  if (action === Course_Audit_Type_Enum.Approved)
    return (
      <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
        {t('pages.create-course.exceptions.course-approve-warning')}
      </Alert>
    )
  return null
}

type ExceptionsApprovalModalContentProps = {
  action: ExceptionsApprovalModalAction
  courseId: string | undefined
  closeModal: () => void
}
export const ExceptionsApprovalModalContent: FC<
  ExceptionsApprovalModalContentProps
> = ({ action, courseId, closeModal }) => {
  const { t } = useTranslation()
  const { addSnackbarMessage } = useSnackbar()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { data: courseInfo, mutate } = useCourse(courseId ?? '')
  const [{ error: approveError }, approveCourse] = useMutation<
    ApproveCourseMutation,
    ApproveCourseMutationVariables
  >(APPROVE_COURSE_MUTATION)
  const [{ error: rejectError }, rejectCourse] = useMutation<
    RejectCourseMutation,
    RejectCourseMutationVariables
  >(REJECT_COURSE_MUTATION)

  const course = courseInfo?.course

  const schema = useMemo(() => {
    return yup.object({
      reason: yup
        .string()
        .trim()
        .required(t('pages.create-course.exceptions.reason-required')),
    })
  }, [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ reason: string }>({ resolver: yupResolver(schema) })

  const submitHandler: SubmitHandler<yup.InferType<typeof schema>> =
    useCallback(
      async data => {
        if (!course) return

        try {
          if (action === Course_Audit_Type_Enum.Approved) {
            await approveCourse({
              input: { courseId: course.id, reason: data.reason },
            })
            mutate()
            navigate('/manage-courses/all', {
              state: {
                action: 'approved',
                course: {
                  id: course.id,
                  code: course.course_code,
                },
              },
            })
          } else if (action === Course_Audit_Type_Enum.Rejected) {
            await rejectCourse({
              input: { courseId: course.id, reason: data.reason },
            })

            navigate('/manage-courses/all', {
              state: {
                action: 'rejected',
                course: {
                  id: course.id,
                  code: course.course_code,
                },
              },
            })
          } else
            console.error(
              'Provided "action" prop is not of Course_Audit_Type_Enum type',
            )
        } catch (e: unknown) {
          console.error(e)
          closeModal()
          addSnackbarMessage('course-approval-error', {
            label: t('errors.generic.unknown-error-please-retry'),
          })
        }
      },
      [
        course,
        action,
        approveCourse,
        mutate,
        navigate,
        rejectCourse,
        closeModal,
        addSnackbarMessage,
        t,
      ],
    )

  useEffect(() => {
    if (rejectError || approveError) {
      addSnackbarMessage('course-approval-error', {
        label: t('errors.generic.unknown-error-please-retry'),
      })
    }
  }, [addSnackbarMessage, approveError, rejectError, t])

  return (
    <Box data-testid="exceptions-approval-modal-content">
      <form noValidate onSubmit={handleSubmit(submitHandler)}>
        <TextField
          error={!!errors.reason?.message}
          fullWidth
          variant="filled"
          label={t('common.reason')}
          required
          helperText={errors.reason?.message ?? ''}
          {...register('reason', {
            required: {
              value: true,
              message: t('pages.create-course.exceptions.reason-required'),
            },
          })}
        />
        <WarningAlert action={action} />
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={isMobile ? 'column' : 'row'}
          sx={{ mt: 4 }}
        >
          <Button
            variant="text"
            fullWidth={isMobile}
            type="button"
            onClick={closeModal}
            sx={{ px: 4 }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="contained"
            fullWidth={isMobile}
            type="submit"
            sx={{ px: 4 }}
          >
            {t('common.submit')}
          </Button>
        </Box>
      </form>
    </Box>
  )
}
