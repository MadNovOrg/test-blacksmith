import DeleteIcon from '@mui/icons-material/Delete'
import { Grid, Button } from '@mui/material'
import { t } from 'i18next'
import { useCallback, useState } from 'react'

import { useAuth } from '@app/context/auth'
import { DeleteCourseModal } from '@app/modules/course/components/DeleteCourseModal'
import { Course as CustomCourseType } from '@app/types'

export const DeleteCourseButton: React.FC<{
  course: CustomCourseType
}> = ({ course }) => {
  const [openDeleteCourseDialog, setOpenDeleteCourseDialog] =
    useState<boolean>(false)
  const { acl } = useAuth()
  const onCloseDeleteCourseDialog = useCallback(
    () => setOpenDeleteCourseDialog(false),
    [],
  )

  if (!acl.canDeleteCourse(course)) {
    return null
  }
  return (
    <Grid item>
      <Button
        color="error"
        data-testid="delete-course-button"
        onClick={() => setOpenDeleteCourseDialog(true)}
        size="large"
        startIcon={<DeleteIcon />}
        variant="contained"
      >
        {t('pages.course-participants.delete-course-button')}
      </Button>
      <DeleteCourseModal
        courseId={course.id}
        onClose={onCloseDeleteCourseDialog}
        open={openDeleteCourseDialog}
      />
    </Grid>
  )
}
