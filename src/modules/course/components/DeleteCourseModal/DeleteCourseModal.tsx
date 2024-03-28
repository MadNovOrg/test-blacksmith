import { LoadingButton } from '@mui/lab'
import { Alert, Button, DialogContentText, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { Dialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import {
  DeleteCourseMutation,
  DeleteCourseMutationVariables,
} from '@app/generated/graphql'
import { DELETE_COURSE } from '@app/queries/courses/delete-course'

export type DeleteCourseModalProps = {
  courseId: number
  onClose: () => void
  open: boolean
}

export const DeleteCourseModal = ({
  courseId,
  onClose,
  open,
}: DeleteCourseModalProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { acl } = useAuth()

  const [{ data, fetching: deleting, error }, deleteCourse] = useMutation<
    DeleteCourseMutation,
    DeleteCourseMutationVariables
  >(DELETE_COURSE)

  useEffect(() => {
    if (data?.delete_course_by_pk?.id) {
      navigate(acl.isTrainer() ? '/courses' : '/manage-courses/all', {
        state: {
          action: 'deleted',
          course: {
            id: data?.delete_course_by_pk?.id,
            code: data?.delete_course_by_pk?.course_code,
          },
        },
      })
    }
  }, [
    acl,
    data?.delete_course_by_pk?.course_code,
    data?.delete_course_by_pk?.id,
    navigate,
  ])

  const deleteCourseSubmit = useCallback(async () => {
    await deleteCourse({ courseId })
  }, [courseId, deleteCourse])

  return (
    <Dialog
      onClose={onClose}
      open={open}
      noPaddings
      slots={{
        Actions: () => (
          <>
            <Button onClick={onClose}>{t('cancel')}</Button>

            <LoadingButton
              data-testid={'delete-org-btn'}
              loading={deleting}
              variant="contained"
              color="error"
              onClick={deleteCourseSubmit}
            >
              {t('delete')}
            </LoadingButton>
          </>
        ),
        Title: () => <Typography variant={'h3'}>Delete course</Typography>,
        Content: () => (
          <DialogContentText sx={{ p: 0 }}>
            {t('pages.course-details.delete-course')}
            {error ? (
              <Alert sx={{ mt: 1 }} severity="error">
                {t('pages.course-details.error-on-course-delete')}
              </Alert>
            ) : null}
          </DialogContentText>
        ),
      }}
    ></Dialog>
  )
}
