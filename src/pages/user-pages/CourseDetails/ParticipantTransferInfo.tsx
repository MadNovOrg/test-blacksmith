import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import React, { useState } from 'react'

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

  const [termsUnderstood, setTermsUnderstood] = useState(false)

  return (
    <Box>
      <Alert severity="warning" variant="outlined" sx={{ mt: 4 }}>
        {t('alert-message')}
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

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button onClick={onCancel}>{t('cancel-btn-text')}</Button>
        <Button
          disabled={!termsUnderstood}
          variant="contained"
          component={LinkBehavior}
          href="../transfer"
        >
          {t('transfer-btn-text')}
        </Button>
      </Box>
    </Box>
  )
}
