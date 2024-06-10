import { Alert, Link, Box, Checkbox, FormControlLabel } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'

import { CancellationTermsTable } from '@app/pages/EditCourse/components/CancellationTermsTable'
import { ACTION_TYPE } from '@app/pages/user-pages/CourseDetails/ModifyAttendanceModal'
import { Course } from '@app/types'

type CancelAttendanceFormProps = {
  course: Course
  cancellationError: string | undefined
  onAgreeTerms: (actionType: ACTION_TYPE, state: boolean) => void
}

export const CancelAttendanceForm: React.FC<
  React.PropsWithChildren<CancelAttendanceFormProps>
> = ({ course, onAgreeTerms, cancellationError }) => {
  const { t } = useTranslation()
  const startDate = course.schedule[0].start

  const [agreeTerms, setAgreeTerms] = useState(false)

  const onAgreeTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setAgreeTerms(isChecked)
    onAgreeTerms(ACTION_TYPE.CANCEL, isChecked)
  }

  return (
    <Box width={750} height={350}>
      <Alert severity="warning" variant="outlined" sx={{ mt: 4 }}>
        <Trans
          i18nKey="pages.course-details.request-cancellation-modal.warning"
          components={{
            termsOfBusinessLink: (
              <Link
                target="_blank"
                rel="noreferrer"
                href={`${
                  import.meta.env.VITE_BASE_WORDPRESS_URL
                }/policies-procedures/terms-of-business/`}
              />
            ),
          }}
        />
      </Alert>

      <CancellationTermsTable
        courseStartDate={new Date(startDate)}
        sx={{ mt: 2 }}
      />

      <Box mt={4}>
        <FormControlLabel
          label={t(
            'pages.edit-course.cancellation-modal.cannot-be-undone-confirmation'
          )}
          control={
            <Checkbox checked={agreeTerms} onChange={onAgreeTermsChange} />
          }
          sx={{ userSelect: 'none' }}
        />
      </Box>

      {cancellationError && <Alert severity="error">{cancellationError}</Alert>}
    </Box>
  )
}
