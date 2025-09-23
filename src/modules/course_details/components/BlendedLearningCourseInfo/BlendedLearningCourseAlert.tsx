import { Alert, Link, SxProps, Theme } from '@mui/material'
import { Trans } from 'react-i18next'

import { useAuth } from '@app/context/auth'

type BlendedLearningCourseAlertProps = {
  sx?: SxProps<Theme>
}

export const BlendedLearningCourseAlert = ({
  sx,
}: BlendedLearningCourseAlertProps) => {
  const { acl } = useAuth()

  return (
    <Alert
      color="error"
      severity="error"
      sx={{ width: '100%', ...sx }}
      variant="standard"
    >
      <Trans
        i18nKey="pages.participant-course.blended-learning-certification-requirements"
        components={{
          blendedLearningLink: (
            <Link
              href={`${
                acl.isUK()
                  ? import.meta.env.VITE_GO1_BASE_URL
                  : import.meta.env.VITE_GO1_ANZ_BASE_URL
              }/login`}
              sx={{ color: '#0000EE' }}
              target="_blank"
              underline="always"
            />
          ),
        }}
      />
    </Alert>
  )
}
