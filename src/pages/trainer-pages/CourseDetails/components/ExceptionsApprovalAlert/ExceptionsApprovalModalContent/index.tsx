import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Box, Button, TextField, useMediaQuery } from '@mui/material'
import { FC, useCallback, useEffect, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
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
  InsertCourseAuditMutation,
  InsertCourseAuditMutationVariables,
  RejectCourseMutation,
  RejectCourseMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import { MUTATION as APPROVE_COURSE_MUTATION } from '@app/queries/courses/approve-course'
import { INSERT_COURSE_AUDIT } from '@app/queries/courses/insert-course-audit'
import { MUTATION as REJECT_COURSE_MUTATION } from '@app/queries/courses/reject-course'
import { yup } from '@app/schemas'
import theme from '@app/theme'

import { ExceptionsApprovalModalAction } from '..'

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
  const fetcher = useFetcher()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { data: course, mutate } = useCourse(courseId ?? '')
  const [{ error: auditError }, insertAudit] = useMutation<
    InsertCourseAuditMutation,
    InsertCourseAuditMutationVariables
  >(INSERT_COURSE_AUDIT)

  const schema = useMemo(() => {
    return yup.object({
      reason: yup
        .string()
        .required(t('pages.create-course.exceptions.reason-required')),
    })
  }, [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ reason: string }>({ resolver: yupResolver(schema) })

  const addNewCourseAudit: (object: Course_Audit_Insert_Input) => void =
    useCallback(
      async object => {
        await insertAudit({ object })
      },
      [insertAudit]
    )

  const submitHandler: SubmitHandler<yup.InferType<typeof schema>> =
    useCallback(
      async data => {
        if (!course) return
        const auditObject = {
          type: action,
          course_id: course?.id,
          payload: { reason: data.reason },
          authorized_by: profile?.id,
        }

        try {
          if (action === Course_Audit_Type_Enum.Approved) {
            addNewCourseAudit(auditObject)
            await fetcher<
              ApproveCourseMutation,
              ApproveCourseMutationVariables
            >(APPROVE_COURSE_MUTATION, { input: { courseId: course.id } })
            await mutate()
            addSnackbarMessage('course-approval-message', {
              label: t('pages.course-details.course-approval-message', {
                action: action.toLocaleLowerCase() ?? 'approved',
              }),
            })
          } else if (action === Course_Audit_Type_Enum.Rejected) {
            addNewCourseAudit(auditObject)
            await fetcher<RejectCourseMutation, RejectCourseMutationVariables>(
              REJECT_COURSE_MUTATION,
              {
                input: { courseId: course.id },
              }
            )
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
      },
      [
        course,
        action,
        profile?.id,
        addNewCourseAudit,
        fetcher,
        mutate,
        addSnackbarMessage,
        t,
        navigate,
        closeModal,
      ]
    )

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
          {action === Course_Audit_Type_Enum.Rejected ? (
            <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
              {t('pages.create-course.exceptions.course-rejection-warning')}
            </Alert>
          ) : null}
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
    </>
  )
}
