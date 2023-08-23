import { useTheme, useMediaQuery } from '@mui/material'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Link from '@mui/material/Link'
import React, { useState } from 'react'
import { Trans } from 'react-i18next'

import { LinkBehavior } from '@app/components/LinkBehavior'
import { CourseLevel } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { TransferTermsTable } from '@app/pages/TransferParticipant/components/TransferTermsTable'

export const ParticipantTransferInfo: React.FC<
  React.PropsWithChildren<{
    startDate: Date
    courseLevel: CourseLevel
    onCancel: () => void
  }>
> = ({ startDate, onCancel, courseLevel }) => {
  const { t } = useScopedTranslation(
    'pages.course-details.modify-my-attendance.transfer-info'
  )
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [termsUnderstood, setTermsUnderstood] = useState(false)

  return (
    <Box>
      <Alert severity="warning" variant="outlined" sx={{ mt: 4 }}>
        {/* {t('alert-message')} */}
        <Trans
          i18nKey="pages.course-details.modify-my-attendance.transfer-info.alert-message"
          components={{
            termsOfBusinessLink: (
              <Link
                target="_blank"
                rel="noreferrer"
                href={`${
                  import.meta.env.VITE_BASE_WORDPRESS_URL
                }/terms-of-business/`}
              />
            ),
          }}
        />
      </Alert>
      <Box mt={2}>
        <TransferTermsTable startDate={startDate} courseLevel={courseLevel} />
      </Box>

      <Box mt={4}>
        <FormControlLabel
          control={
            <Checkbox onClick={() => setTermsUnderstood(!termsUnderstood)} />
          }
          label={t('terms-notice')}
        />
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        mt={4}
        flexDirection={isMobile ? 'column' : 'row'}
      >
        <Button fullWidth={isMobile} onClick={onCancel}>
          {t('cancel-btn-text')}
        </Button>
        <Button
          disabled={!termsUnderstood}
          variant="contained"
          component={LinkBehavior}
          fullWidth={isMobile}
          href="../transfer"
        >
          {t('transfer-btn-text')}
        </Button>
      </Box>
    </Box>
  )
}
