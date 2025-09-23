import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { BlendedLearningStatus } from '@app/types'

type BlendedLearningCourseCompleteProps = {
  blendedLearningStatus: BlendedLearningStatus
}

export const BlendedLearningCourseComplete = ({
  blendedLearningStatus,
}: BlendedLearningCourseCompleteProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { acl } = useAuth()

  const { t } = useTranslation()

  return (
    <Box
      marginBottom={2}
      padding={2}
      sx={{
        alignItems: 'center',
        backgroundColor: theme.palette.grey[100],
        display: 'flex',
      }}
    >
      <Grid alignItems={'center'} container>
        <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
        <Typography fontWeight={500} sx={{ flexGrow: 1 }}>
          {t('pages.participant-course.blended-learning')}
        </Typography>
        {blendedLearningStatus === BlendedLearningStatus.COMPLETED ? (
          <Chip
            label={t(`blended-learning-status.${blendedLearningStatus}`)}
            color={'success'}
          />
        ) : (
          <>
            <Chip
              label={t(`blended-learning-status.${blendedLearningStatus}`)}
              sx={{ marginRight: 2 }}
            />
            <Link
              href={`${
                acl.isUK()
                  ? import.meta.env.VITE_GO1_BASE_URL
                  : import.meta.env.VITE_GO1_ANZ_BASE_URL
              }/logout`}
              target="_blank"
            >
              <Button
                color="secondary"
                fullWidth={isMobile}
                sx={{ mt: isMobile ? 2 : 0 }}
                variant="contained"
              >
                {t('pages.participant-course.complete-blended-learning')}
              </Button>
            </Link>
          </>
        )}
      </Grid>
    </Box>
  )
}
